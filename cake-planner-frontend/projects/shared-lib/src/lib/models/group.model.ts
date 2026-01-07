export interface Group {
  id: string; // UUID
  name: string;
  memberCount?: number; // Optional: Für die Anzeige in der Tabelle
  createdAt?: string;
}
