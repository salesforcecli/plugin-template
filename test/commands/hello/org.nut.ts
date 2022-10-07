/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { Env } from '@salesforce/kit';
import { ensureString } from '@salesforce/ts-types';

export interface Organization {
  orgId: string;
  outputString: string;
}

describe('Limits display', () => {
  const env = new Env();
  let username: string;
  let testSession: TestSession;

  before('prepare session and ensure environment variables', async () => {
    username = ensureString(env.getString('TESTKIT_HUB_USERNAME'));
    testSession = await TestSession.create({
      setupCommands: [`sfdx force:org:create edition=Developer -a MyScratchOrg -s -v=${username}`],
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  it('tests the name flag', () => {
    const output = execCmd<Organization>(`hello:org --name ${username} --json`, { ensureExitCode: 0 }).jsonOutput;
    expect(output.result.orgId).length.greaterThan(0);
    expect(output.status).to.equal(0);
  });

  it('tests the location flag', () => {
    const output = execCmd<Organization>('hello:org --location "San Francisco" --json', {
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
