/**
 * @file event-dialog.spec.ts
 * @brief Unit tests for the EventDialog component.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDialog } from './event-dialog';

describe('EventDialog', () => {
  let component: EventDialog;
  let fixture: ComponentFixture<EventDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});