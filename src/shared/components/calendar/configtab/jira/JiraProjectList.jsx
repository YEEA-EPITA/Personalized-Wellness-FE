// components/JiraProjectList.jsx
import React from 'react';

const JiraProjectList = ({
  selectedJiraAccount,
  jiraProjects,
  jiraProjectsLoading,
  jiraProjectsError,
  handleJiraProjectSelect
}) => {
  if (!selectedJiraAccount) return null;

  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '16px'
      }}>
        Step 2: Select Project
      </label>

      {jiraProjectsLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }}></div>
          Loading Jira projects...
        </div>
      ) : jiraProjectsError ? (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          borderRadius: '4px',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }}>
          Error loading projects: {jiraProjectsError}
        </div>
      ) : jiraProjects.length === 0 ? (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No projects found for this account.
        </div>
      ) : (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {jiraProjects.map((project, index) => (
            <div
              key={project.id + project.key}
              style={{
                padding: '12px 15px',
                borderBottom: index < jiraProjects.length - 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
              onClick={() => handleJiraProjectSelect(selectedJiraAccount, project)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                backgroundColor: '#1976d2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                {project.key}
              </div>
              <div>
                <div style={{ fontWeight: '500', color: '#333' }}>
                  {project.name}
                  {project.cloudId && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 'normal'
                    }}>
                      {project.cloudId.substring(0, 8)}...
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Key: {project.key}
                  {project.cloudId && (
                    <span style={{ marginLeft: '8px', color: '#999' }}>
                      • CloudId: {project.cloudId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JiraProjectList;
