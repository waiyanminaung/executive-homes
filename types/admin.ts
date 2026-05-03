export interface AdminRequestItem {
  id: string;
  title: string;
  createdAt: string;
}

export interface AdminReportItem {
  id: string;
  title: string;
  reason: string | null;
  description: string;
  createdAt: string;
}
