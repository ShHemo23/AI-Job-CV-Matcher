
'use server';
/**
 * @fileOverview An AI agent for parsing resume data and extracting profile information.
 * This file uses server-side text extraction for improved accuracy.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import mammoth from 'mammoth';
// Do not use a top-level import for pdf-parse, as it causes bundling issues with Next.js
// We will require it dynamically inside the function where it is used.


// Define the input schema: accepts the resume as a data URI.
const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume/CV file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

// Define the output schema: structured profile data extracted from the resume.
const ParseResumeOutputSchema = z.object({
  name: z.string().optional().describe('The full name of the candidate.'),
  title: z.string().optional().describe('The professional title or headline (e.g., "Senior Web Developer", ".NET Software Engineer"). This should be a short, specific job title and NOT a long summary paragraph.'),
  bio: z.string().optional().describe("The full professional summary or bio section from the resume. This should be the entire introductory paragraph, not shortened."),
  city: z.string().optional().describe('The city of residence of the candidate.'),
  country: z.string().optional().describe('The country of residence of the candidate.'),
  skills: z.array(z.string()).optional().describe('A list of extracted skills.'),
  experience: z
    .array(
      z.object({
        title: z.string().describe('The job title for the experience entry.'),
        company: z.string().describe('The company name for the experience entry.'),
        duration: z.string().describe('The duration of employment (e.g., 2020 - Present, 3 years).'),
        description: z.string().describe("A description of responsibilities and achievements. Each bullet point or distinct responsibility should be separated by a newline character (\\n)."),
      })
    )
    .optional()
    .describe('A list of professional work experiences.'),
  portfolioLinks: z
    .array(
      z.object({
        label: z.string().describe('The label for the link (e.g., "GitHub", "LinkedIn", "Portfolio").'),
        url: z.string().url().describe('The full URL of the link.'),
      })
    )
    .optional()
    .describe('A list of portfolio or social media links found in the resume.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

// Exported async function that calls the Genkit flow.
export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  console.log("Calling parseResumeFlow with data URI starting with:", input.resumeDataUri.substring(0, 100) + "...");
  const result = await parseResumeFlow(input);
  console.log("parseResumeFlow result:", result);
  return result;
}

// Helper to extract text from different file types
async function extractTextFromDataUri(dataUri: string): Promise<string> {
  const meta = dataUri.substring(0, dataUri.indexOf(','));
  const base64Data = dataUri.substring(dataUri.indexOf(',') + 1);
  const buffer = Buffer.from(base64Data, 'base64');

  if (meta.includes('application/pdf')) {
    // Use a direct require statement to bypass Next.js bundling issues with pdf-parse.
    const pdf = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdf(buffer);
    return data.text;
  } else if (meta.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
}


// Define the Genkit prompt for resume parsing from extracted text.
const prompt = ai.definePrompt({
  name: 'parseResumePromptFromText',
  input: {
    schema: z.object({
        extractedText: z.string().describe("The full text content extracted from a resume file.")
    }),
  },
  output: {
    schema: ParseResumeOutputSchema,
  },
  prompt: `You are an expert HR assistant specialized in parsing resume content. Analyze the following extracted resume text and extract the candidate's profile information. Structure the output according to the provided JSON schema.

IMPORTANT:
- The 'title' field should ONLY contain the main job title or headline (e.g., ".NET Software Engineer", "Senior Product Manager"). It MUST NOT include the summary paragraph.
- The 'bio' field should contain the ENTIRE professional summary or overview paragraph. Do not shorten or summarize it.
- For each work experience 'description', preserve the bullet points. Each bullet point or distinct responsibility should be separated by a newline character (\\n).

Focus on extracting:
- Full Name
- Professional Title/Headline (short, specific)
- Bio/Summary (the full introductory paragraph)
- Location (City and Country)
- List of Skills (technical and soft skills)
- Work Experience (job title, company, duration, description with newlines)
- Portfolio & Social Links (e.g., GitHub, LinkedIn, Personal Website)

Extracted Resume Text:
{{{extractedText}}}

Ensure the output strictly adheres to the JSON format described in the output schema. If a field is not clearly present, omit it or provide an empty array for lists.`,
});

// Define the Genkit flow.
const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    // Step 1: Extract text from the file data URI
    const extractedText = await extractTextFromDataUri(input.resumeDataUri);
    if (!extractedText.trim()) {
        throw new Error("Could not extract any text from the provided file. It may be empty or corrupted.");
    }
    
    console.log("Extracted text length:", extractedText.length);
    // console.log("Extracted text sample:", extractedText.substring(0, 500) + "...");

    // Step 2: Call the LLM with the extracted text
    const { output } = await prompt({ extractedText });
    
    // Step 3: Ensure arrays exist even if the LLM omits them, for UI consistency
    return {
        name: output?.name,
        title: output?.title,
        bio: output?.bio,
        city: output?.city,
        country: output?.country,
        skills: output?.skills ?? [],
        experience: output?.experience ?? [],
        portfolioLinks: output?.portfolioLinks ?? [],
    };
  }
);
