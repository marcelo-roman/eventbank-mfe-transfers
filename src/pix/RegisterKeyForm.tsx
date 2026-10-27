import { type SyntheticEvent, useState } from 'react';
import { useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type PixKeyType } from '../shared/types';
import { useAccounts } from '../transfers/api';
import { useProfile, useRegisterKey } from './api';

const types: PixKeyType[] = ['Cpf', 'Email', 'Phone', 'Random'];

function presetValue(type: PixKeyType, cpf: string | undefined, email: string): string {
  if (type === 'Cpf') {
    return cpf ?? '';
  }
  return type === 'Email' ? email : '';
}

function KeyHint({ type, value }: { type: PixKeyType; value: string }) {
  const { t } = useLocale();
  if (type === 'Random') {
    return <p className="muted">{t.register.randomHint}</p>;
  }
  if (type === 'Phone') {
    return null;
  }
  return <p className="muted">{t.register.ownHint(t.keyTypes[type], value)}</p>;
}

export function RegisterKeyForm() {
  const { t } = useLocale();
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
      <h2>{t.register.title}</h2>
      <label className="field">
        <span>{t.register.account}</span>
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
        <span>{t.register.keyType}</span>
        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value as PixKeyType);
          }}
        >
          {types.map((option) => (
            <option key={option} value={option}>
              {t.keyTypes[option]}
            </option>
          ))}
        </select>
      </label>
      {type === 'Phone' && (
        <label className="field">
          <span>{t.register.phone}</span>
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
        {register.isPending ? t.register.registering : t.register.submit}
      </button>
      <ErrorMessage error={register.error} />
    </form>
  );
}
