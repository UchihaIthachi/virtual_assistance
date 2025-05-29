# Prerequisites for Running the Application

To use this application, you need to configure several API keys and Supabase details. Please follow the steps below:

1.  **Create a new Supabase Project:**
    *   Go to [Supabase](https://supabase.com/).
    *   Sign in or create a new account.
    *   Click on "New project" and follow the instructions to create a new project. Choose a region that is geographically close to you or your users for best performance.

2.  **Enable the pgvector extension in Supabase:**
    *   Once your project is created, navigate to the "SQL Editor" in the Supabase dashboard (usually found in the left sidebar).
    *   Click on "+ New query".
    *   Enter the following SQL command and click "RUN":
        ```sql
        CREATE EXTENSION IF NOT EXISTS vector;
        ```
    *   This enables vector embeddings, which are necessary for certain features of the application.

3.  **Find your Supabase Project URL and `anon` public key:**
    *   In your Supabase project dashboard, go to "Project Settings" (usually a gear icon).
    *   Navigate to the "API" section.
    *   You will find your "Project URL" and the "Project API keys".
    *   Copy the "Project URL".
    *   Copy the `anon` (public) key. **Do not use the `service_role` (secret) key here.**

4.  **Obtain a Gemini API Key from Google AI Studio:**
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Sign in with your Google account.
    *   Click on "Create API key". You might need to create a new project if you don't have one already.
    *   Copy the generated API key.

5.  **Update the `Backend/.env` file:**
    *   Open the `Backend/.env` file in your project.
    *   Replace the placeholder values with the actual keys and URL you obtained:
        *   `YOUR_SUPABASE_URL` with your Supabase Project URL.
        *   `YOUR_SUPABASE_ANON_KEY` with your Supabase `anon` public key.
        *   `YOUR_GEMINI_API_KEY` with your Gemini API Key.
    *   The file should look like this after updating (example values shown):
        ```env
        SUPABASE_URL=https://xyzabcdefghij.supabase.co
        SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.abcdefghijklmnopqrstuvwxyz
        GEMINI_API_KEY=AIzaSy***********************************

        # Existing HuggingFace variables (can be left as is or removed if no longer needed)
        HF_API_TOKEN=your_hf_api_token 
        HF_API_URL=your_hf_api_url
        HF_API_URL2=your_hf_api_url2
        ```
    *   Save the `Backend/.env` file.

After completing these steps, your application should be able to connect to Supabase and use the Gemini API.
