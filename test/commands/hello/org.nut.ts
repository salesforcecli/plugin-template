/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';

export interface Organization {
  orgId: string;
  outputString: string;
}

describe('Limits display', () => {
  let testSession: TestSession;

  before('prepare session and ensure environment variables', async () => {
    testSession = await TestSession.create({
      devhubAuthStrategy: 'AUTO',
      scratchOrgs: [
        {
          executable: 'sfdx',
          edition: 'developer',
          alias: 'MyScratchOrg',
          setDefault: true,
        },
      ],
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  it('tests the name flag', () => {
    const username = testSession.orgs.get('default').username;
    const output = execCmd<Organization>(`hello:org --name ${username} --json`, { ensureExitCode: 0 }).jsonOutput;
    expect(output.result.orgId).length.greaterThan(0);
    expect(output.status).to.equal(0);
  });

  it('tests the location flag', () => {
    const output = execCmd<Organization>("hello:org --location 'San Francisco' --json", {
      ensureExitCode: 0,
    }).jsonOutput;
    expect(output.result.outputString).contains('San Francisco');
    expect(output.status).to.equal(0);
  });

  it('tests the location flag default', () => {
    const output = execCmd<Organization>('hello:org --json', { ensureExitCode: 0 }).jsonOutput;
    expect(output.result.outputString).contains('a hidden location');
    expect(output.status).to.equal(0);
  });
});
