import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import AgentDispositionModal from './AgentDispositionModal';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'CrmIntegrationPlugin';

export default class CrmIntegrationPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    var Number;
    manager.workerClient.on("reservationCreated", function(reservation) {
      if (reservation.task.taskChannelUniqueName === 'voice') {
             Number= " "+reservation.task.attributes.from+" ";
             console.log("number-------------------------------------------------------------------------------------",Number);
             console.log(typeof(Number));
             console.log("Outside---------->",Number);
      }
    });
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("Outside---------->",Number);
    flex.RootContainer.Content.add(<AgentDispositionModal Call_id={ Number } key="AgentDispositionModal"></AgentDispositionModal>, {
      sortOrder: 1
    })

    flex.Actions.addListener('beforeCompleteTask', (payload, abort) => {
      // publish a window event to open the modal component
      var event = new Event('agentDispositionModalOpen');
      window.dispatchEvent(event);

      // returns a promise to modify the beforeCompleteTask Behavior
      return new Promise((resolve, reject) => {

        // if the agent successfully selects a disposition
        window.addEventListener('agentDispositionSuccessful', (e) => {
          // get existing attributes
          let attributes = payload.task.attributes;
          // merge new attributes
          attributes = Object.assign(attributes, {
            conversations: {
              outcome: e.detail.disposition
            }
          });
          // set new attributes on the task
          payload.task.setAttributes(attributes);
          // complete the task
          resolve(`Agent completed task with code: ${e.detail.disposition}`);
        }, false)

        // if the agent decides to cancel the modal window
        window.addEventListener('agentDispositionCanceled', (e) => {
          abort()
          reject('Agent Canceled Disposition');
        }, false)

      })
    })
  }
}
