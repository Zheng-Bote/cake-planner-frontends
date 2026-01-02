export interface EventRating {
  average: number;
  count: number;
  myRating: number; // 0 = noch nicht bewertet
}

export interface CakeEvent {
  id: string;
  groupId: string;
  groupName?: string;
  bakerId: string;
  bakerName: string;
  date: string; // YYYY-MM-DD
  description: string;
  photoUrl?: string; // Pfad zum Bild des Erstellers

  // Berechtigungen & Status
  isOwner: boolean;
  isFuture: boolean;
  canDelete: boolean;

  // Rating
  rating: EventRating;
}
