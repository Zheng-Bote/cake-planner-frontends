/**
 * @file public-api.ts
 * @brief Public API surface for the shared library.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
/*
 * Public API Surface of shared-lib
 */

export * from './lib/shared-lib';

export * from './lib/services/auth.service';
export * from './lib/services/event.service';
export * from './lib/services/admin.service';
export * from './lib/services/systeminfo.service';
export * from './lib/services/sse.service';
export * from './lib/services/theme.service';

export * from './lib/models/user.model';
export * from './lib/models/2fa.model';
export * from './lib/models/event.model';
export * from './lib/models/systeminfo.model';

export * from './lib/guards/auth.guard';
export * from './lib/guards/admin.guard';

export * from './lib/components/two-factor-setup/two-factor-setup';
export * from './lib/interceptors/auth.interceptor';

//export * from './lib/shared-lib.component'; // falls vorhanden
//export * from './lib/shared-lib.service';   // falls vorhanden