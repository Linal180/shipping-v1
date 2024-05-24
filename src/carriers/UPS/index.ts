import axios from "axios";
import { getDHLHeaders } from "../../lib";

const axiosDhlClient = axios.create({
  baseURL: process.env.DHL_API_ENDPOINT || 'https://express.api.dhl.com/mydhlapi',
  headers: getDHLHeaders()
});
