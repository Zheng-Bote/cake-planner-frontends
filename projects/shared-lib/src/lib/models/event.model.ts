/**
 * @file event.model.ts
 * @brief Models for events.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
export interface GalleryItem {
  userName: string;
  url: string;
  isMine: boolean;
}

export interface EventRating {
  average: number;
  count: number;
  myRating: number; // 0 = not yet rated
}

export interface CakeEvent {
  id: string;
  groupId: string;
  groupName?: string;
  bakerId: string;
  bakerName: string;
  date: string; // YYYY-MM-DD
  description: string;
  photoUrl?: string; // Path to the creator's image or logo as default
  gallery: GalleryItem[]; // List of community photos

  // Permissions & Status
  isOwner: boolean;
  isFuture: boolean;
  canDelete: boolean;

  // Rating
  rating: EventRating;
}