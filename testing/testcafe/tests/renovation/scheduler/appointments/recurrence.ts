import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Renovated scheduler - Recurrent appointments');

[
  { currentView: 'day', expected: 2 },
  { currentView: 'week', expected: 6 },
  { currentView: 'month', expected: 6 },
].forEach(({ currentView, expected }) => {
  test(`it should render recurrent appointments correctly if currentView is ${currentView}`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointmentCount = scheduler.getAppointmentCount();

    await t
      .expect(appointmentCount)
      .eql(expected)
      .expect(await compareScreenshot(
        t,
        `scheduler-appointments-recurrence-${currentView}.png`,
        scheduler.element,
        screenshotComparerOptions,
      ))
      .ok();
  }).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        dataSource: [{
          text: 'Recurrence-1',
          priorityId: [1, 2],
          startDate: new Date(2021, 3, 21, 12),
          endDate: new Date(2021, 3, 22, 10),
          recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }],
        views: [{
          type: 'day',
          groupOrientation: 'vertical',
        }, {
          type: 'week',
          groupOrientation: 'vertical',
        }, {
          type: 'month',
          groupOrientation: 'vertical',
        }],
        currentView,
        currentDate: new Date(2021, 3, 21),
        startDayHour: 10,
        endDayHour: 14,
        groups: ['priorityId'],
        resources: [
          {
            fieldExpr: 'priorityId',
            allowMultiple: true,
            dataSource: [{
              text: 'Low Priority',
              id: 1,
              color: '#1e90ff',
            }, {
              text: 'High Priority',
              id: 2,
              color: '#ff9747',
            }],
            label: 'Priority',
          },
        ],
        showCurrentTimeIndicator: false,
      });
    },
  ).after(async (t) => restoreBrowserSize(t));
});
