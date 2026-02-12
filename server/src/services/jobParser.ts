import { parseStringPromise } from "xml2js";

export class JobParserService {
    async parseXML(xml: string): Promise<any> {
        try {
            const result = await parseStringPromise(xml, {
                explicitArray: false,
                trim: true,
            });

            return result;
        } catch (error) {
            console.error("XML Parsing failed", error);
            throw error;
        }
    }
}
