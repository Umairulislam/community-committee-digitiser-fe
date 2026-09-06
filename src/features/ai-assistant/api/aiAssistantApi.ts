import { baseApi } from '@/api/baseApi';
import type { AskAssistantParams, AskAssistantResponse } from '../types';

export const aiAssistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Ask the AI Committee Assistant a natural-language question.
     * POST /ai/assistant
     *
     * The backend builds a JSON context from the user's authorised
     * committee data and returns an LLM-generated answer. This is
     * a mutation because each call is a discrete request/response —
     * no cache tags are needed.
     */
    askAssistant: builder.mutation<AskAssistantResponse, AskAssistantParams>({
      query: (body) => ({
        url: '/ai/assistant',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAskAssistantMutation } = aiAssistantApi;
