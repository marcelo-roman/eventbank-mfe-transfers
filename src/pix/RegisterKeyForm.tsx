import { type SyntheticEvent, useState } from 'react';
import { useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { type PixKeyType } from '../shared/types';
import { useAccounts } from '../transfers/api';
import { keyTypeLabels, useProfile, useRegisterKey } from './api';

const types: PixKeyType[] = ['Cpf', 'Email', 'Phone', 'Random'];

function presetValue(type: PixKeyType, cpf: string | undefined, email: string): string {
  if (type === 'Cpf') {
    return cpf ?? '';
  }
  return type === 'Email' ? email : '';
}

function KeyHint({ type, value }: { type: PixKeyType; value: string }) {
  if (type === 'Random') {
    return <p className="muted">EventBank generates a random key for you.</p>;
  }
  if (type === 'Phone') {
    return null;
  }
  return (
    <p className="muted">
      Uses your own {keyTypeLabels[type]}: {value}
    </p>
  );
}

export function RegisterKeyForm() {
  const user = useUser();
  const profile = useProfile();
  const accounts = useAccounts();
  const register = useRegisterKey();
  const [type, setType] = useState<PixKeyType>('Email');
  const [phone, setPhone] = useState('');
  const [accountId, setAccountId] = useState('');

  const open = (accounts.data ?? []).filter((account) => account.status === 'Open');
  const target = open.find((account) => account.id === accountId) ?? open[0];
  const value = type === 'Phone' ? phone : presetValue(type, profile.data?.cpf, user.email);

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (target) {
      register.mutate(
        { accountId: target.id, type, value },
        {
          onSuccess: () => {
            setPhone('');
          },
        },
      );
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Register a key</h2>
      <label className="field">
        <span>Account</span>
        <select
          value={target?.id ?? ''}
          onChange={(event) => {
            setAccountId(event.target.value);
          }}
        >
          {open.map((account) => (
            <option key={account.id} value={account.id}>
              {account.currency} {account.branch}/{account.number}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Key type</span>
        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value as PixKeyType);
          }}
        >
          {types.map((option) => (
            <option key={option} value={option}>
              {keyTypeLabels[option]}
            </option>
          ))}
        </select>
      </label>
      {type === 'Phone' && (
        <label className="field">
          <span>Phone</span>
          <input
            inputMode="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
            placeholder="(11) 98765-4321"
            required
          />
        </label>
      )}
      <KeyHint type={type} value={value} />
      <button type="submit" className="button primary" disabled={register.isPending || !target}>
        {register.isPending ? 'Registering…' : 'Register key'}
      </button>
      <ErrorMessage error={register.error} />
    </form>
  );
}
