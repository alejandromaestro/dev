import { html, fixture, expect } from '@open-wc/testing';

import '../src/memory-cards';

describe('<memory-cards>', () => {
  it('has a default property header', async () => {
    const el = await fixture('<memory-cards></memory-cards>');
    expect(el.title).to.equal('open-wc');
  });

  it('allows property header to be overwritten', async () => {
    const el = await fixture(html`
      <memory-cards title="different"></memory-cards>
    `);
    expect(el.title).to.equal('different');
  });
});
