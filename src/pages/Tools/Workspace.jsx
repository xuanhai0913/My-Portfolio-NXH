import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getInitialToolInputs, getToolBySlug, TOOL_STATUS } from '../../data/tools';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './styles/Workspace.css';

const severityLabel = {
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
  info: 'INFO'
};

const WorkflowMap = ({ workflow }) => (
  <section className="agent-flow" aria-labelledby="agent-flow-title">
    <div className="agent-flow-heading">
      <div>
        <span>GENERATED EXECUTION GRAPH</span>
        <h2 id="agent-flow-title">AGENT FLOW</h2>
      </div>
      <span>{String(workflow.agents.length).padStart(2, '0')} AGENTS</span>
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
                WAITS FOR {agent.dependsOn.map((dependency) => `#${dependency}`).join(' + ')}
              </p>
            )}
            <p className="agent-mission">{agent.mission}</p>
            <div className="agent-deliverable">
              <span>DELIVERABLE</span>
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
        <h3>HANDOFF CONTRACTS</h3>
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
        <h3>QUALITY GATES</h3>
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
  const { slug } = useParams();
  const { localizePath } = useLocaleNavigation();
  const tool = getToolBySlug(slug);
  const abortRef = useRef(null);
  const [inputs, setInputs] = useState(() => getInitialToolInputs(tool));
  const [runState, setRunState] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedArtifact, setCopiedArtifact] = useState('');

  useEffect(() => {
    setInputs(getInitialToolInputs(tool));
    setRunState('idle');
    setResult(null);
    setError('');
    return () => abortRef.current?.abort();
  }, [tool]);

  if (!tool || tool.status !== TOOL_STATUS.LIVE) {
    return <Navigate to={localizePath('/tools')} replace />;
  }

  const updateInput = (name, value) => {
    setInputs((current) => ({ ...current, [name]: value }));
  };

  const resetExample = () => {
    abortRef.current?.abort();
    setInputs(getInitialToolInputs(tool));
    setRunState('idle');
    setResult(null);
    setError('');
  };

  const runTool = async (event) => {
    event.preventDefault();

    const missingField = tool.fields.find((field) => field.required && !inputs[field.name]?.trim());
    if (missingField) {
      setError(`${missingField.label} is required.`);
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
      const response = await fetch(`/api/tools/${tool.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.success || !payload.result) {
        throw new Error(payload.message || 'The tool could not complete this run.');
      }

      setResult(payload.result);
      setRunState('success');
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      setError(requestError.message || 'Unexpected request error.');
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
        <Link to={localizePath('/tools')} className="workspace-back">← ALL TOOLS</Link>
        <div className="workspace-title-block">
          <span>{tool.type} / {tool.index}</span>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <div className="workspace-runtime">
          <span className="runtime-dot" aria-hidden="true"></span>
          GEMINI RUNTIME
        </div>
      </header>

      <div className="workspace-grid">
        <form className="workspace-input" onSubmit={runTool}>
          <div className="workspace-panel-heading">
            <span>01 / INPUT</span>
            <button type="button" onClick={resetExample}>RESET EXAMPLE</button>
          </div>

          <div className="workspace-fields">
            {tool.fields.map((field) => (
              <label className={`workspace-field workspace-field--${field.type}`} key={field.name}>
                <span>{field.label}{field.required ? ' *' : ''}</span>
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
                    placeholder={field.placeholder}
                    maxLength="500"
                    onChange={(event) => updateInput(field.name, event.target.value)}
                  />
                ) : (
                  <textarea
                    value={inputs[field.name] || ''}
                    placeholder={field.placeholder}
                    maxLength="12000"
                    spellCheck="false"
                    onChange={(event) => updateInput(field.name, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="workspace-submit-row">
            <p>Do not submit secrets, credentials, or personal health information.</p>
            <button type="submit" disabled={runState === 'running'}>
              {runState === 'running' ? 'ANALYZING...' : 'RUN TOOL'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        <section className="workspace-output" aria-live="polite" aria-busy={runState === 'running'}>
          <div className="workspace-panel-heading">
            <span>02 / OUTPUT</span>
            <span className={`workspace-state workspace-state--${runState}`}>{runState.toUpperCase()}</span>
          </div>

          {runState === 'idle' && (
            <div className="workspace-empty">
              <span>READY_</span>
              <p>Review the example input, then run the tool. Results remain in this browser session only.</p>
            </div>
          )}

          {runState === 'running' && (
            <div className="workspace-loading">
              <div className="workspace-loading-bar"></div>
              <p>Analyzing supplied evidence and preparing structured output...</p>
            </div>
          )}

          {runState === 'error' && (
            <div className="workspace-error">
              <span>RUN FAILED</span>
              <p>{error}</p>
              <button type="button" onClick={runTool}>TRY AGAIN</button>
            </div>
          )}

          {runState === 'success' && result && (
            <div className="workspace-result">
              <div className="result-summary">
                <span>SUMMARY</span>
                <p>{result.summary}</p>
              </div>

              {result.workflow?.agents?.length > 0 && (
                <WorkflowMap workflow={result.workflow} />
              )}

              {result.findings?.length > 0 && (
                <div className="result-section">
                  <h2>FINDINGS</h2>
                  <div className="result-findings">
                    {result.findings.map((finding, index) => (
                      <article key={`${finding.title}-${index}`}>
                        <span className={`finding-severity finding-severity--${finding.severity}`}>
                          {severityLabel[finding.severity] || 'INFO'}
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
                      {copiedArtifact === String(index) ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                  <pre><code>{artifact.content}</code></pre>
                </div>
              ))}

              {result.nextActions?.length > 0 && (
                <div className="result-section result-actions">
                  <h2>NEXT ACTIONS</h2>
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
        <span>AI output may be incomplete or incorrect.</span>
        <span>VERIFY BEFORE USE / NO INPUT PERSISTENCE</span>
      </footer>
    </main>
  );
};

export default Workspace;
