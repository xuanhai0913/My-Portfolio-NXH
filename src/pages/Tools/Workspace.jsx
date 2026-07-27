import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToolBySlug, TOOL_STATUS } from '../../data/tools';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './styles/Workspace.css';

const getLocalizedInputs = (tool, t) => (
  (tool?.fields || []).reduce((values, field) => ({
    ...values,
    [field.name]: t(`tools.items.${tool.slug}.fields.${field.name}.defaultValue`, {
      defaultValue: field.defaultValue || ''
    })
  }), {})
);

const WorkflowMap = ({ workflow, t }) => (
  <section className="agent-flow" aria-labelledby="agent-flow-title">
    <div className="agent-flow-heading">
      <div>
        <span>{t('workspace.generatedGraph')}</span>
        <h2 id="agent-flow-title">{t('workspace.agentFlow')}</h2>
      </div>
      <span>{t('workspace.agentCount', { count: String(workflow.agents.length).padStart(2, '0') })}</span>
    </div>

    <div className="agent-lanes">
      {workflow.agents.map((agent, index) => (
        <article className="agent-node" key={agent.id}>
          <div className="agent-node-index">A{String(index + 1).padStart(2, '0')}</div>
          <div className="agent-node-content">
            <div className="agent-node-title">
              <h3>{agent.name}</h3>
              <span>{agent.id}</span>
            </div>
            {agent.dependsOn.length > 0 && (
              <p className="agent-dependencies">
                {t('workspace.waitsFor')} {agent.dependsOn.map((dependency) => `#${dependency}`).join(' + ')}
              </p>
            )}
            <p className="agent-mission">{agent.mission}</p>
            <div className="agent-deliverable">
              <span>{t('workspace.deliverable')}</span>
              <p>{agent.deliverable}</p>
            </div>
            {agent.tools.length > 0 && (
              <div className="agent-tools">
                {agent.tools.map((agentTool) => <span key={agentTool}>{agentTool}</span>)}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>

    {workflow.handoffs.length > 0 && (
      <div className="agent-handoffs">
        <h3>{t('workspace.handoffContracts')}</h3>
        {workflow.handoffs.map((handoff, index) => (
          <div key={`${handoff.from}-${handoff.to}-${index}`}>
            <span>{handoff.from}</span>
            <b aria-hidden="true">→</b>
            <span>{handoff.to}</span>
            <p>{handoff.evidence}</p>
          </div>
        ))}
      </div>
    )}

    {workflow.qualityGates.length > 0 && (
      <div className="agent-gates">
        <h3>{t('workspace.qualityGates')}</h3>
        <ol>
          {workflow.qualityGates.map((gate, index) => (
            <li key={`${gate}-${index}`}>
              <span>G{String(index + 1).padStart(2, '0')}</span>
              {gate}
            </li>
          ))}
        </ol>
      </div>
    )}
  </section>
);

const Workspace = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { localizePath } = useLocaleNavigation();
  const tool = getToolBySlug(slug);
  const abortRef = useRef(null);
  const [inputs, setInputs] = useState(() => getLocalizedInputs(tool, t));
  const [runState, setRunState] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedArtifact, setCopiedArtifact] = useState('');

  useEffect(() => {
    setInputs(getLocalizedInputs(tool, t));
    setRunState('idle');
    setResult(null);
    setError('');
    return () => abortRef.current?.abort();
  }, [tool, t, i18n.resolvedLanguage]);

  if (!tool || tool.status !== TOOL_STATUS.LIVE) {
    return <Navigate to={localizePath('/tools')} replace />;
  }

  const updateInput = (name, value) => {
    setInputs((current) => ({ ...current, [name]: value }));
  };

  const resetExample = () => {
    abortRef.current?.abort();
    setInputs(getLocalizedInputs(tool, t));
    setRunState('idle');
    setResult(null);
    setError('');
  };

  const runTool = async (event) => {
    event.preventDefault();

    const missingField = tool.fields.find((field) => field.required && !inputs[field.name]?.trim());
    if (missingField) {
      const fieldLabel = t(`tools.items.${tool.slug}.fields.${missingField.name}.label`, {
        defaultValue: missingField.label
      });
      setError(t('workspace.required', { field: fieldLabel }));
      setRunState('error');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRunState('running');
    setResult(null);
    setError('');

    try {
      const response = await fetch('/api/tool-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: tool.slug,
          inputs,
          locale: i18n.resolvedLanguage === 'vi' ? 'vi' : 'en'
        }),
        signal: controller.signal
      });
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => ({}))
        : {};

      if (!response.ok || !payload.success || !payload.result) {
        const fallbackMessage = [404, 405].includes(response.status)
          ? t('workspace.runtimeUnavailable')
          : t('workspace.runFailedMessage');
        throw new Error(payload.message || fallbackMessage);
      }

      setResult(payload.result);
      setRunState('success');
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      setError(requestError.message || t('workspace.unexpectedError'));
      setRunState('error');
    }
  };

  const copyArtifact = async (artifact, index) => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopiedArtifact(String(index));
      window.setTimeout(() => setCopiedArtifact(''), 1600);
    } catch (copyError) {
      setCopiedArtifact('');
    }
  };

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link to={localizePath('/tools')} className="workspace-back">← {t('workspace.allTools')}</Link>
        <div className="workspace-title-block">
          <span>{t(`tools.items.${tool.slug}.type`, { defaultValue: tool.type })} / {tool.index}</span>
          <h1>{tool.name}</h1>
          <p>{t(`tools.items.${tool.slug}.description`, { defaultValue: tool.description })}</p>
        </div>
        <div className="workspace-runtime">
          <span className="runtime-dot" aria-hidden="true"></span>
          {t('workspace.runtime')}
        </div>
      </header>

      <div className="workspace-grid">
        <form className="workspace-input" onSubmit={runTool}>
          <div className="workspace-panel-heading">
            <span>01 / {t('tools.input')}</span>
            <button type="button" onClick={resetExample}>{t('workspace.resetExample')}</button>
          </div>

          <div className="workspace-fields">
            {tool.fields.map((field) => (
              <label className={`workspace-field workspace-field--${field.type}`} key={field.name}>
                <span>
                  {t(`tools.items.${tool.slug}.fields.${field.name}.label`, { defaultValue: field.label })}
                  {field.required ? ' *' : ''}
                </span>
                {field.type === 'select' ? (
                  <select
                    value={inputs[field.name] || ''}
                    onChange={(event) => updateInput(field.name, event.target.value)}
                  >
                    {field.options.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                ) : field.type === 'text' ? (
                  <input
                    type="text"
                    value={inputs[field.name] || ''}
                    placeholder={t(`tools.items.${tool.slug}.fields.${field.name}.placeholder`, { defaultValue: field.placeholder })}
                    maxLength="500"
                    onChange={(event) => updateInput(field.name, event.target.value)}
                  />
                ) : (
                  <textarea
                    value={inputs[field.name] || ''}
                    placeholder={t(`tools.items.${tool.slug}.fields.${field.name}.placeholder`, { defaultValue: field.placeholder })}
                    maxLength="12000"
                    spellCheck="false"
                    onChange={(event) => updateInput(field.name, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="workspace-submit-row">
            <p>{t('workspace.safetyNotice')}</p>
            <button type="submit" disabled={runState === 'running'}>
              {runState === 'running' ? t('workspace.analyzing') : t('tools.runTool')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        <section className="workspace-output" aria-live="polite" aria-busy={runState === 'running'}>
          <div className="workspace-panel-heading">
            <span>02 / {t('tools.output')}</span>
            <span className={`workspace-state workspace-state--${runState}`}>{t(`workspace.states.${runState}`)}</span>
          </div>

          {runState === 'idle' && (
            <div className="workspace-empty">
              <span>{t('workspace.ready')}</span>
              <p>{t('workspace.readyDescription')}</p>
            </div>
          )}

          {runState === 'running' && (
            <div className="workspace-loading">
              <div className="workspace-loading-bar"></div>
              <p>{t('workspace.analyzingDescription')}</p>
            </div>
          )}

          {runState === 'error' && (
            <div className="workspace-error">
              <span>{t('workspace.runFailed')}</span>
              <p>{error}</p>
              <button type="button" onClick={runTool}>{t('common.retry')}</button>
            </div>
          )}

          {runState === 'success' && result && (
            <div className="workspace-result">
              <div className="result-summary">
                <span>{t('workspace.summary')}</span>
                <p>{result.summary}</p>
              </div>

              {result.workflow?.agents?.length > 0 && (
                <WorkflowMap workflow={result.workflow} t={t} />
              )}

              {result.findings?.length > 0 && (
                <div className="result-section">
                  <h2>{t('workspace.findings')}</h2>
                  <div className="result-findings">
                    {result.findings.map((finding, index) => (
                      <article key={`${finding.title}-${index}`}>
                        <span className={`finding-severity finding-severity--${finding.severity}`}>
                          {t(`workspace.severity.${finding.severity}`, { defaultValue: t('workspace.severity.info') })}
                        </span>
                        <div>
                          <h3>{finding.title}</h3>
                          <p>{finding.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {result.artifacts?.map((artifact, index) => (
                <div className="result-section result-artifact" key={`${artifact.title}-${index}`}>
                  <div className="artifact-heading">
                    <div>
                      <span>{artifact.language}</span>
                      <h2>{artifact.title}</h2>
                    </div>
                    <button type="button" onClick={() => copyArtifact(artifact, index)}>
                      {copiedArtifact === String(index) ? t('workspace.copied') : t('workspace.copy')}
                    </button>
                  </div>
                  <pre><code>{artifact.content}</code></pre>
                </div>
              ))}

              {result.nextActions?.length > 0 && (
                <div className="result-section result-actions">
                  <h2>{t('workspace.nextActions')}</h2>
                  <ol>
                    {result.nextActions.map((action, index) => <li key={`${action}-${index}`}>{action}</li>)}
                  </ol>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <footer className="workspace-footer">
        <span>{t('workspace.outputDisclaimer')}</span>
        <span>{t('workspace.verifyNotice')}</span>
      </footer>
    </main>
  );
};

export default Workspace;
