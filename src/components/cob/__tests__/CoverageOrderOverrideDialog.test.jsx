import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoverageOrderOverrideDialog from '../CoverageOrderOverrideDialog';

/**
 * The override: reason required, old-vs-new confirmation, and reordering that
 * works without a pointer.
 */

const ROWS = [
  { coverageId: 'cov-a', label: 'Cigna — Open Access Plus', explanation: 'Birthday rule.' },
  { coverageId: 'cov-b', label: 'Aetna — Choice POS II', explanation: 'Later birthday.' },
  { coverageId: 'cov-c', label: 'United — Choice Plus' },
];

const setup = (props = {}) =>
  render(
    <CoverageOrderOverrideDialog
      open
      onClose={jest.fn()}
      coverages={ROWS}
      onSubmit={jest.fn()}
      {...props}
    />
  );

describe('CoverageOrderOverrideDialog — reason', () => {
  it('will not move past the reorder step without a reason', async () => {
    const user = userEvent.setup();
    setup();

    // Reorder, but give no reason.
    await user.click(screen.getByTestId('cob-override-down-1'));

    expect(screen.getByTestId('cob-override-review')).toBeDisabled();

    await user.type(screen.getByLabelText('Why are you changing the order?'), 'Payer confirmed.');

    expect(screen.getByTestId('cob-override-review')).toBeEnabled();
  });

  it('enforces the backend validator’s 10-character minimum', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('cob-override-down-1'));
    await user.type(screen.getByLabelText('Why are you changing the order?'), 'too short');

    // Nine characters — the endpoint would reject this with a 400, so the UI
    // refuses first.
    expect(screen.getByTestId('cob-override-review')).toBeDisabled();

    await user.type(screen.getByLabelText('Why are you changing the order?'), ' now it is fine');
    expect(screen.getByTestId('cob-override-review')).toBeEnabled();
  });

  it('will not submit when nothing has actually moved', async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByLabelText('Why are you changing the order?'),
      'A perfectly good reason.'
    );

    expect(screen.getByTestId('cob-override-review')).toBeDisabled();
  });
});

describe('CoverageOrderOverrideDialog — confirmation', () => {
  it('shows the old order against the new one before saving', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    await user.click(screen.getByTestId('cob-override-down-1'));
    await user.type(
      screen.getByLabelText('Why are you changing the order?'),
      'Aetna confirmed they pay first.'
    );
    await user.click(screen.getByTestId('cob-override-review'));

    const confirmation = screen.getByTestId('cob-override-confirmation');

    const oldOrder = within(confirmation).getByTestId('cob-override-old');
    expect(oldOrder).toHaveTextContent('Primary: Cigna — Open Access Plus');
    expect(oldOrder).toHaveTextContent('Secondary: Aetna — Choice POS II');

    const newOrder = within(confirmation).getByTestId('cob-override-new');
    expect(newOrder).toHaveTextContent('Primary: Aetna — Choice POS II');
    expect(newOrder).toHaveTextContent('Secondary: Cigna — Open Access Plus');

    expect(confirmation).toHaveTextContent('Aetna confirmed they pay first.');

    // Nothing is sent until the confirmation is accepted.
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('cob-override-confirm'));

    expect(onSubmit).toHaveBeenCalledWith({
      orderedCoverageIds: ['cov-b', 'cov-a', 'cov-c'],
      reason: 'Aetna confirmed they pay first.',
    });
  });

  it('lets the user go back and change their mind', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('cob-override-down-1'));
    await user.type(
      screen.getByLabelText('Why are you changing the order?'),
      'A reason long enough to pass.'
    );
    await user.click(screen.getByTestId('cob-override-review'));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByTestId('cob-override-reason')).toBeInTheDocument();
  });
});

describe('CoverageOrderOverrideDialog — keyboard and screen readers', () => {
  it('reorders entirely from the keyboard', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    // Tab to the first row's "move down" and activate it with the keyboard.
    const moveDown = screen.getByTestId('cob-override-down-1');
    moveDown.focus();
    expect(moveDown).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.getByTestId('cob-override-row-1')).toHaveTextContent('Aetna — Choice POS II');
    expect(screen.getByTestId('cob-override-row-2')).toHaveTextContent('Cigna — Open Access Plus');

    // And the third row can be promoted with the up button, also by keyboard.
    const moveUp = screen.getByTestId('cob-override-up-3');
    moveUp.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByTestId('cob-override-row-2')).toHaveTextContent('United — Choice Plus');

    const reason = screen.getByLabelText('Why are you changing the order?');
    reason.focus();
    await user.keyboard('Set by hand after calling both payers.');

    await user.keyboard('{Tab}');
    await user.click(screen.getByTestId('cob-override-review'));
    await user.click(screen.getByTestId('cob-override-confirm'));

    expect(onSubmit).toHaveBeenCalledWith({
      orderedCoverageIds: ['cov-b', 'cov-c', 'cov-a'],
      reason: 'Set by hand after calling both payers.',
    });
  });

  it('gives every reorder control a spoken label naming the plan and the destination', () => {
    setup();

    expect(
      screen.getByRole('button', { name: 'Move Aetna — Choice POS II up to position 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Move Cigna — Open Access Plus down to position 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Reorder Cigna — Open Access Plus. Press space, then use the arrow keys.',
      })
    ).toBeInTheDocument();
  });

  it('disables the moves that would fall off either end', () => {
    setup();

    expect(screen.getByTestId('cob-override-up-1')).toBeDisabled();
    expect(screen.getByTestId('cob-override-down-3')).toBeDisabled();
    expect(screen.getByTestId('cob-override-down-1')).toBeEnabled();
  });

  it('names the reorder list for screen readers', () => {
    setup();
    expect(screen.getByRole('list', { name: 'Insurance order' })).toBeInTheDocument();
  });
});
