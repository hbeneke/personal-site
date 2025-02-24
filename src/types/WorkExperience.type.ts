export interface WorkExperience {
  start_date: string;
  end_date: string;
  position: string;
  company: string;
  company_url: string;
  location: string;
  description: string;
  responsibilities: string[];
  startup: boolean;
}

export interface ResumeCollection {
  data: {
    work_experience: WorkExperience[];
  };
}
