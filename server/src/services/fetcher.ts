import axios from "axios";

export class JobFetcherService {
    async fetchXML(url: string): Promise<string> {
        try {
            const response = await axios.get(url, {
                responseType: "text",
                timeout: 20000
            });

            return response.data;
        } catch (error) {
            console.error(`Failed to fetch from ${url}`, error);
            throw error;
        }
    }
}
