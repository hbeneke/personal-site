export interface WorkExperience {
  company: string;
  startup: boolean;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  responsibilities: string[];
  website?: string;
  company_url?: string;
  location?: string;
}
