import { TransferForm } from './TransferForm';
import { TransferList } from './TransferList';

export function TransfersPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Transfers</h1>
        <p className="lede">
          A transfer touches two accounts, so it cannot be one transaction. It runs as a saga: debit the source, credit
          the destination, and refund the source if the credit is declined.
        </p>
      </header>
      <div className="split">
        <TransferList />
        <aside className="panel">
          <TransferForm />
        </aside>
      </div>
    </div>
  );
}
