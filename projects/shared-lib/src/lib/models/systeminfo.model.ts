/**
 * @file systeminfo.model.ts
 * @brief Models for system information.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
export interface SystemInfoFrontend {
  userAppVersion?: string;
  adminAppVersion?: string;
  AngularVersion?: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  created?: string;
}

export interface SystemInfoBackend {
  project_name?: string;
  prog_longname?: string;
  description?: string;
  version?: string;
  homepage?: string;
  author?: string;
  license?: string;
  created_year?: string;
  organization?: string;
  domain?: string;
  cxx_standard?: string;
  compiler?: string;
  qt_version?: string;
}