import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para adicionar e editar entradas
function TelefoneForm({ aoSalvar, contatoParaEditar, aoCancelarEdicao }) {
  const estadoInicialFormulario = { id: null, nome: '', numero: '', endereco: '', apelido: '' };
  const [dadosFormulario, setDadosFormulario] = useState(estadoInicialFormulario);
  const [erros, setErros] = useState({});

  const estaEditando = Boolean(contatoParaEditar && contatoParaEditar.id);

  useEffect(() => {
    if (estaEditando) {
      setDadosFormulario({
        id: contatoParaEditar.id,
        nome: contatoParaEditar.nome,
        numero: contatoParaEditar.numero,
        endereco: contatoParaEditar.endereco,
        apelido: contatoParaEditar.apelido,
      });
      setErros({});
    } else {
      setDadosFormulario(estadoInicialFormulario);
    }
  }, [contatoParaEditar]);

  const lidarMudanca = (e) => {
    const { name, value } = e.target;
    setDadosFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
    if (erros[name] && value.trim()) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!dadosFormulario.nome.trim()) novosErros.nome = 'O nome é obrigatório';
    if (!dadosFormulario.numero.trim()) {
      novosErros.numero = 'O número de telefone é obrigatório';
    } else if (!/^[+\d()-\s]+$/.test(dadosFormulario.numero)) {
      novosErros.numero = 'Formato de número de telefone inválido';
    }
    if (!dadosFormulario.endereco.trim()) novosErros.endereco = 'O endereço é obrigatório';
    if (!dadosFormulario.apelido.trim()) novosErros.apelido = 'O apelido é obrigatório';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  const lidarEnvio = (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    aoSalvar(dadosFormulario);
    if (!estaEditando) {
      setDadosFormulario(estadoInicialFormulario);
    }
    setErros({});
  };

  const lidarCancelar = () => {
    setDadosFormulario(estadoInicialFormulario);
    setErros({});
    if (estaEditando && aoCancelarEdicao) {
      aoCancelarEdicao();
    }
  }

  return (
    <form onSubmit={lidarEnvio} className="mb-4 p-3 border rounded bg-light">
      <h3 className="mb-3">{estaEditando ? 'Editar Contato' : 'Adicionar Novo Contato'}</h3>
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome:</label>
        <input
          type="text"
          className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
          id="nome"
          name="nome"
          value={dadosFormulario.nome}
          onChange={lidarMudanca}
          required
        />
        {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="numero" className="form-label">Número de Telefone:</label>
        <input
          type="tel"
          className={`form-control ${erros.numero ? 'is-invalid' : ''}`}
          id="numero"
          name="numero"
          value={dadosFormulario.numero}
          onChange={lidarMudanca}
          required
        />
        {erros.numero && <div className="invalid-feedback">{erros.numero}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="endereco" className="form-label">Endereço:</label>
        <input
          type="text"
          className={`form-control ${erros.endereco ? 'is-invalid' : ''}`}
          id="endereco"
          name="endereco"
          value={dadosFormulario.endereco}
          onChange={lidarMudanca}
          required
        />
        {erros.endereco && <div className="invalid-feedback">{erros.endereco}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="apelido" className="form-label">Apelido:</label>
        <input
          type="text"
          className={`form-control ${erros.apelido ? 'is-invalid' : ''}`}
          id="apelido"
          name="apelido"
          value={dadosFormulario.apelido}
          onChange={lidarMudanca}
          required
        />
        {erros.apelido && <div className="invalid-feedback">{erros.apelido}</div>}
      </div>
      <div className="d-flex justify-content-end">
        {estaEditando && (
          <button type="button" className="btn btn-secondary me-2" onClick={lidarCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {estaEditando ? 'Atualizar Contato' : 'Adicionar Contato'}
        </button>
      </div>
    </form>
  );
}
export default TelefoneForm;