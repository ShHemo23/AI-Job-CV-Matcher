
'use server';
/**
 * @fileOverview An AI agent for matching freelancers with jobs.
 *
 * - findJobMatches - A function that handles the job matching process.
 * - FindJobMatchesInput - The input type for the findJobMatches function.
 * - FindJobMatchesOutput - The return type for the findJobMatches function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { allJobs } from '@/lib/job-data';

const FindJobMatchesInputSchema = z.object({
  freelancerProfile: z
    .string()
    .describe('The profile of the freelancer including skills and experience.'),
});
export type FindJobMatchesInput = z.infer<typeof FindJobMatchesInputSchema>;

const FindJobMatchesOutputSchema = z.object({
  matches: z.array(
    z.object({
      jobId: z.string().describe('The ID of the job posting.'),
      fitScore: z
        .number()
        .describe('A score indicating how well the freelancer matches the job (0-1).'),
      justification: z
        .string()
        .describe('Explanation of why the freelancer is a good fit for the job.'),
    })
  ),
});
export type FindJobMatchesOutput = z.infer<typeof FindJobMatchesOutputSchema>;

export async function findJobMatches(input: FindJobMatchesInput): Promise<FindJobMatchesOutput> {
  return findJobMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findJobMatchesPrompt',
  input: {
    schema: z.object({
      freelancerProfile: z
        .string()
        .describe('The profile of the freelancer including skills and experience.'),
      jobPostings: z
        .string()
        .describe(
          'A list of job postings with descriptions of the job, required skills, and budget.'
        ),
    }),
  },
  output: {
    schema: z.object({
      matches: z.array(
        z.object({
          jobId: z.string().describe('The ID of the job posting.'),
          fitScore: z
            .number()
            .describe('A score indicating how well the freelancer matches the job (0-1).'),
          justification: z
            .string()
            .describe('Explanation of why the freelancer is a good fit for the job.'),
        })
      ),
    }),
  },
  prompt: `You are an AI job matching expert. Given the freelancer profile and a list of available job postings, determine the fit score for each job posting and provide a justification.

Freelancer Profile: {{{freelancerProfile}}}

Available Job Postings: {{{jobPostings}}}

Output the matches in JSON format.`,
});

const findJobMatchesFlow = ai.defineFlow(
  {
    name: 'findJobMatchesFlow',
    inputSchema: FindJobMatchesInputSchema,
    outputSchema: FindJobMatchesOutputSchema,
  },
  async input => {
    // Convert the allJobs array into a JSON string for the prompt
    const jobPostingsString = JSON.stringify(allJobs.map(job => ({
        jobId: job.id,
        title: job.title,
        description: job.description,
        skills: job.skills,
        budget: job.budget,
    })));
    
    const promptInput = {
        freelancerProfile: input.freelancerProfile,
        jobPostings: jobPostingsString,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
