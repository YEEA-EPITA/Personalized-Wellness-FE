import React, { useState, useCallback } from 'react';
import { getRequest } from '@/shared/utils/requests';
import { SERVERS } from '@/shared/constants/general';
import JiraSelectionList from './JiraSelectionList';
import JiraAccountList from './JiraAccountList';
import JiraProjectList from './JiraProjectList';



const ConfigModalJiraTab = ({ config, setConfig, googleAccounts, googleAccountsLoading, googleAccountsError }) => {
  const [selectedJiraAccount, setSelectedJiraAccount] = useState(null);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [jiraProjectsLoading, setJiraProjectsLoading] = useState(false);
  const [jiraProjectsError, setJiraProjectsError] = useState(null);

  // Only show JIRA type accounts from the API response
  const safeGoogleAccounts = Array.isArray(googleAccounts) ? googleAccounts : [];
  
  // Filter to show only JIRA type accounts
  const filteredJiraAccounts = safeGoogleAccounts.filter(account => account.type === 'JIRA');
  
  const allAccounts = filteredJiraAccounts;
  const allAccountsLoading = googleAccountsLoading;

  // Fetch Jira projects from API, group by cloudId and make separate calls
  const fetchJiraProjects = useCallback(async (jiraEmail) => {
    console.log('🔍 Fetching Jira projects for:', jiraEmail);
    setJiraProjectsLoading(true);
    setJiraProjectsError(null);
    
    try {
      // Step 1: Get all projects first
      console.log('📡 Step 1: Getting all projects for account:', jiraEmail);
      const response = await getRequest({ server: SERVERS.java.value })({
        endpoint: `/jira/projects?jiraEmail=${encodeURIComponent(jiraEmail)}`
      });
      
      console.log('✅ All projects response:', response.data);
      
      // Extract projects from response
      const allProjects = response.data.body || response.data || [];
      console.log('📋 All projects received:', allProjects);
      
      if (!Array.isArray(allProjects) || allProjects.length === 0) {
        console.warn('⚠️ No projects found for account');
        setJiraProjects([]);
        return;
      }
      
      // Step 2: Group projects by cloudId
      console.log('📊 Step 2: Grouping projects by cloudId...');
      const projectsByCloudId = allProjects.reduce((groups, project) => {
        const cloudId = project.cloudId;
        if (!groups[cloudId]) {
          groups[cloudId] = [];
        }
        groups[cloudId].push(project);
        return groups;
      }, {});
      
      console.log('� Projects grouped by cloudId:', projectsByCloudId);
      
      const cloudIds = Object.keys(projectsByCloudId);
      console.log('🔍 Found cloudIds:', cloudIds);
      console.log(`📊 Making ${cloudIds.length} separate API calls for each cloudId`);
      
      // Step 3: Make separate API calls for each cloudId group
      const cloudIdPromises = cloudIds.map(async (cloudId, index) => {
        const projectsInGroup = projectsByCloudId[cloudId];
        const projectKeys = projectsInGroup.map(p => p.key);
        
        console.log(`🔍 API Call ${index + 1}/${cloudIds.length} - CloudId: ${cloudId}`);
        console.log(`📋 Projects in this group: ${projectKeys.join(', ')}`);
        
        try {
          // Make API call with projects for this specific cloudId

          // Return the projects with cloudId info
          return {
            cloudId,
            projects: projectsInGroup
          };
        } catch (error) {
          console.error(`❌ Error for cloudId ${cloudId}:`, error);
          return {
            cloudId,
            projects: projectsInGroup,
            error: error.message
          };
        }
      });
      
      // Wait for all cloudId-specific requests to complete
      console.log('⏳ Waiting for all cloudId-specific requests to complete...');
      const cloudIdResults = await Promise.all(cloudIdPromises);
      
      // Process results and combine all projects
      let finalProjects = [];
      cloudIdResults.forEach((result, index) => {
        console.log(`📊 Result ${index + 1} - CloudId: ${result.cloudId}`);
        if (result.error) {
          console.error(`❌ CloudId ${result.cloudId} failed:`, result.error);
          // Still include the projects even if the additional call failed
          finalProjects.push(...result.projects);
        } else {
          console.log(`✅ CloudId ${result.cloudId} succeeded`);
          finalProjects.push(...result.projects);
        }
      });
      
      console.log('📊 Final projects count:', finalProjects.length);
      console.log('📋 Final projects:', finalProjects);
      
      setJiraProjects(finalProjects);
      
    } catch (error) {
      console.error('❌ Error fetching Jira projects:', error);
      setJiraProjectsError(error.message);
      setJiraProjects([]);
    } finally {
      setJiraProjectsLoading(false);
    }
  }, []);

  // Jira handlers
  const handleJiraAccountSelect = useCallback(async (accountEmail) => {
    console.log('🎯 Jira account selected:', accountEmail);
    setSelectedJiraAccount(accountEmail);
    
    // Fetch projects for this account
    await fetchJiraProjects(accountEmail);
  }, [fetchJiraProjects]);

  const handleJiraProjectSelect = useCallback((accountEmail, project) => {
    setConfig(prev => {
      const existingSelections = prev.jira.selections.filter(s => !(s.account === accountEmail && s.project?.id === project.id));
      const newSelection = {
        account: accountEmail,
        project: project,
        status: ['To Do', 'In Progress', 'Done'] // Fixed status list
      };
      
      return {
        ...prev,
        jira: {
          selections: [...existingSelections, newSelection]
        }
      };
    });
  }, [setConfig]);

  const handleJiraStatusToggle = useCallback((accountEmail, projectId, status) => {
    setConfig(prev => {
      const updatedSelections = prev.jira.selections.map(selection => {
        if (selection.account === accountEmail && selection.project?.id === projectId) {
          const currentStatus = selection.status || [];
          const newStatus = currentStatus.includes(status)
            ? currentStatus.filter(s => s !== status)
            : [...currentStatus, status];
          
          return { ...selection, status: newStatus };
        }
        return selection;
      });
      
      return {
        ...prev,
        jira: { selections: updatedSelections }
      };
    });
  }, [setConfig]);

  const removeJiraSelection = useCallback((accountEmail, projectId) => {
    console.log('🗑️ Removing Jira selection:', { accountEmail, projectId });
    setConfig(prev => ({
      ...prev,
      jira: {
        selections: prev.jira.selections.filter(s => {
          // Handle cases where project might be null/undefined
          const selectionProjectId = s.project?.id || null;
          const isMatch = s.account === accountEmail && selectionProjectId === projectId;
          console.log('🔍 Checking selection:', { 
            selectionAccount: s.account, 
            selectionProjectId, 
            targetAccount: accountEmail, 
            targetProjectId: projectId, 
            isMatch 
          });
          return !isMatch;
        })
      }
    }));
  }, [setConfig]);

  const removeJiraSelectionByIndex = useCallback((index) => {
    console.log('🗑️ Removing Jira selection by index:', index);
    setConfig(prev => ({
      ...prev,
      jira: {
        selections: prev.jira.selections.filter((_, i) => i !== index)
      }
    }));
  }, [setConfig]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      

      <JiraAccountList
        allAccounts={allAccounts}
        allAccountsLoading={allAccountsLoading}
        selectedJiraAccount={selectedJiraAccount}
        handleJiraAccountSelect={handleJiraAccountSelect}
      />

      <JiraProjectList
        selectedJiraAccount={selectedJiraAccount}
        jiraProjects={jiraProjects}
        jiraProjectsLoading={jiraProjectsLoading}
        jiraProjectsError={jiraProjectsError}
        handleJiraProjectSelect={handleJiraProjectSelect}
      />

      <JiraSelectionList
        config={config}
        removeJiraSelectionByIndex={removeJiraSelectionByIndex}
        handleJiraStatusToggle={handleJiraStatusToggle}
      />
    </div>
  );
};

export default ConfigModalJiraTab;
