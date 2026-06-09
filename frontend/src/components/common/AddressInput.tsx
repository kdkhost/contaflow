import { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import MaskedInput from './MaskedInput';
import { buscarCEP } from '../../utils/cep';
import { notifyError } from '../../utils/notify';

interface AddressInputProps {
  value: { cep: string; logradouro: string; numero: string; complemento: string; bairro: string; cidade: string; uf: string; };
  onChange: (address: AddressInputProps['value']) => void;
  errors?: Record<string, string>;
}

const ufOptions = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function AddressInput({ value, onChange, errors = {} }: AddressInputProps) {
  const [loading, setLoading] = useState(false);

  const handleCEPChange = async (cep: string) => {
    onChange({ ...value, cep });
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      setLoading(true);
      const endereco = await buscarCEP(cep);
      setLoading(false);
      if (endereco) {
        onChange({ ...value, cep, logradouro: endereco.logradouro, bairro: endereco.bairro, cidade: endereco.localidade, uf: endereco.uf });
      } else {
        notifyError('CEP nao encontrado');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <MapPinIcon className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="text-sm font-semibold text-white">Endereco</span>
        {loading && <span className="text-xs text-indigo-400 animate-pulse">Buscando...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MaskedInput mask="cep" label="CEP" value={value.cep} onChange={handleCEPChange} error={errors.cep} placeholder="00000-000" />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Logradouro</label>
          <input
            type="text"
            value={value.logradouro}
            onChange={(e) => onChange({ ...value, logradouro: e.target.value })}
            className={`input-premium ${errors.logradouro ? '!border-red-500/50' : ''}`}
            placeholder="Rua, Avenida, etc."
          />
          {errors.logradouro && <p className="text-xs text-red-400 mt-1">{errors.logradouro}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Numero</label>
          <input type="text" value={value.numero} onChange={(e) => onChange({ ...value, numero: e.target.value })} className="input-premium" placeholder="Numero" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Complemento</label>
          <input type="text" value={value.complemento} onChange={(e) => onChange({ ...value, complemento: e.target.value })} className="input-premium" placeholder="Apto, Sala, Bloco, etc." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Bairro</label>
          <input type="text" value={value.bairro} onChange={(e) => onChange({ ...value, bairro: e.target.value })} className={`input-premium ${errors.bairro ? '!border-red-500/50' : ''}`} placeholder="Bairro" />
          {errors.bairro && <p className="text-xs text-red-400 mt-1">{errors.bairro}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Cidade</label>
          <input type="text" value={value.cidade} onChange={(e) => onChange({ ...value, cidade: e.target.value })} className={`input-premium ${errors.cidade ? '!border-red-500/50' : ''}`} placeholder="Cidade" />
          {errors.cidade && <p className="text-xs text-red-400 mt-1">{errors.cidade}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">UF</label>
          <select value={value.uf} onChange={(e) => onChange({ ...value, uf: e.target.value })} className={`input-premium ${errors.uf ? '!border-red-500/50' : ''}`}>
            <option value="">UF</option>
            {ufOptions.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
          {errors.uf && <p className="text-xs text-red-400 mt-1">{errors.uf}</p>}
        </div>
      </div>
    </div>
  );
}
