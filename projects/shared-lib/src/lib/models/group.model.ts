/**
 * @file group.model.ts
 * @brief Model for groups.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
export interface Group {
  id: string; // UUID
  name: string;
  memberCount?: number; // Optional: For display in the table
  createdAt?: string;
}