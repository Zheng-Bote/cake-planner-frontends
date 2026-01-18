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
