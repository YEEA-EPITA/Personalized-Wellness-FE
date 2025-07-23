import { useState, useEffect, useMemo, useRef } from 'react';
import { postRequest, putRequest, deleteRequest, getRequest } from "@/shared/utils/requests";
import { SERVERS } from "@/shared/constants/general";
import usePlatformsStore from '@/shared/zustand/stores/usePlatformsStore';

export const useCalendarEvents = (calendarConfig, startDate, endDate) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('test date 678', startDate, endDate);
  const fetchingRef = useRef(false);

  const activeConfig = useMemo(() => {
    const merged = {
      jiraEmail: [],
      jiraProjects: [],
      trelloEmail: [],
      trelloLists: [],
      jira: { selections: [] },
      trello: { selections: [] },
      google: { selections: [] },
      email: { account: null, filters: {} },
      ...calendarConfig
    };

    const jiraEmail = merged.jira?.selections?.[0]?.account || merged.jiraEmail;
    const jiraProjects = merged.jira?.selections?.map(s => s.project?.key).filter(Boolean) || merged.jiraProjects;

    const trelloEmail = merged.trello?.selections?.[0]?.account || merged.trelloEmail;
    const trelloLists = merged.trello?.selections?.map(s => s.list?.id).filter(Boolean) || merged.trelloLists;

    return {
      ...merged,
      jiraEmail,
      jiraProjects,
      trelloEmail,
      trelloLists
    };
  }, [calendarConfig, startDate, endDate]);

  const fetchAllEvents = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const [jiraRes, trelloRes, googleRes, emailRes] = await Promise.allSettled([
        fetchJiraEvents(),
        fetchTrelloEvents(),
        fetchGoogleEvents(),
        fetchEmailEvents()
      ]);

      const all = [];
      if (jiraRes.status === 'fulfilled') all.push(...jiraRes.value);
      if (trelloRes.status === 'fulfilled') all.push(...trelloRes.value);
      if (googleRes.status === 'fulfilled') all.push(...googleRes.value);
      if (emailRes.status === 'fulfilled') all.push(...emailRes.value);

      setEvents(all);
    } catch (e) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const fetchJiraEvents = async () => {
    if (!activeConfig.jiraEmail || activeConfig.jiraProjects.length === 0) return [];
    const payload = {
      jiraEmail: activeConfig.jiraEmail,
      jiraProjects: activeConfig.jiraProjects,
      startDate: `${startDate}T00:00:00.000+0100`,
      endDate: `${endDate}T23:59:59.000+0100`
    };
    const res = await postRequest({ server: SERVERS.java.value })({ endpoint: "/jira/tasks", payload });
    return (res.data.body || []).map(task => ({
      Id: `jira-${task.issueKey}`,
      Subject: `[JIRA-${task.issueKey}] ${task.summary}`,
      StartTime: task.dueDate ? new Date(`${task.dueDate}T09:00:00`) : new Date(task.createdAt),
      EndTime: task.dueDate ? new Date(`${task.dueDate}T10:00:00`) : new Date(new Date(task.createdAt).getTime() + 3600000),
      Description: `Project: ${task.projectKey}\nStatus: ${task.status}\nType: ${task.issueType}`,
      Platform: 'jira'
    }));
  };

  const fetchTrelloEvents = async () => {
    const selections = activeConfig.trello?.selections || [];
    if (selections.length === 0) return [];
    const results = [];

    for (const sel of selections) {
      const payload = {
        trelloEmail: sel.account,
        listIds: [sel.list.id],
        startDate,
        endDate
      };
      const res = await postRequest({ server: SERVERS.java.value })({ endpoint: "/trello/cards/from-lists", payload });
      const cards = res.data.body || [];
      results.push(...cards.map(card => ({
        Id: `trello-${card.id}`,
        Subject: `[TRELLO] ${card.name}`,
        StartTime: new Date(`${card.dueDate || card.createdAt}T09:00:00`),
        EndTime: new Date(`${card.dueDate || card.createdAt}T10:00:00`),
        Description: `Board: ${card.boardName}\nList: ${card.listName}`,
        Platform: 'trello'
      })));
    }
    return results;
  };

  const fetchGoogleEvents = async () => {
    const selections = activeConfig.google?.selections || [];
    if (selections.length === 0) return [];
    const results = [];
    for (const sel of selections) {
      const query = new URLSearchParams({
        account: sel.account,
        calendarId: sel.calendar.id,
        limit: '100',
        startDate,
        endDate
      });
      const res = await getRequest({ server: SERVERS.node.value })({ endpoint: `/google/calendar/events?${query.toString()}` });
      const items = res.data.body?.items || [];
      results.push(...items.map(event => ({
        Id: `google-${event.id}`,
        Subject: `[GOOGLE] ${event.summary || 'Untitled'}`,
        StartTime: new Date(event.start?.dateTime || `${event.start?.date}T00:00:00`),
        EndTime: new Date(event.end?.dateTime || `${event.end?.date}T23:59:59`),
        Description: event.description || '',
        Platform: 'google'
      })));
    }
    return results;
  };

  const fetchEmailEvents = async () => {
    const account = activeConfig.email?.account;
    if (!account) {
      console.log('📧 No email account configured, skipping...');
      return [];
    }
    
    console.log('📧 Fetching email events for account:', account.email);
    const payload = {
      emails: [account.email],
      startTime: startDate,
      endTime: endDate
    };
    console.log('📧 Email payload:', payload);
    
    const res = await postRequest({ server: SERVERS.node.value })({ endpoint: '/email/events/filter', payload });
    console.log('📧 Raw email API response:', res);
    console.log('📧 Response data:', res.data);
    console.log('📧 Response body:', res.data?.body);
    
    const allEvents = [];
    
    // Try different response structures
    if (res.data?.body?.events && Array.isArray(res.data.body.events)) {
      console.log('📧 Using nested events structure');
      res.data.body.events.forEach((group, groupIndex) => {
        console.log(`📧 Processing group ${groupIndex}:`, group);
        if (group.events && Array.isArray(group.events)) {
          allEvents.push(...group.events.map((email, i) => {
            console.log(`📧 Processing email ${i}:`, email);
            return {
              Id: `email-${groupIndex}-${i}-${Date.now()}`,
              Subject: `📧 ${email.subject || 'No Subject'}`,
              StartTime: new Date(email.startTime),
              EndTime: new Date(email.endTime),
              Description: email.bodyPreview || '',
              Platform: 'email'
            };
          }));
        }
      });
    } else if (res.data?.body && Array.isArray(res.data.body)) {
      console.log('📧 Using direct body array structure');
      allEvents.push(...res.data.body.map((email, i) => {
        console.log(`📧 Processing direct email ${i}:`, email);
        return {
          Id: `email-direct-${i}-${Date.now()}`,
          Subject: `📧 ${email.subject || 'No Subject'}`,
          StartTime: new Date(email.startTime || email.receivedDateTime || email.createdDateTime),
          EndTime: new Date(email.endTime || new Date(new Date(email.receivedDateTime || email.createdDateTime).getTime() + 60 * 60 * 1000)),
          Description: email.bodyPreview || email.body?.content?.substring(0, 100) || '',
          Platform: 'email'
        };
      }));
    } else if (Array.isArray(res.data)) {
      console.log('📧 Using direct data array structure');
      allEvents.push(...res.data.map((email, i) => {
        console.log(`📧 Processing root email ${i}:`, email);
        return {
          Id: `email-root-${i}-${Date.now()}`,
          Subject: `📧 ${email.subject || 'No Subject'}`,
          StartTime: new Date(email.startTime || email.receivedDateTime || email.createdDateTime),
          EndTime: new Date(email.endTime || new Date(new Date(email.receivedDateTime || email.createdDateTime).getTime() + 60 * 60 * 1000)),
          Description: email.bodyPreview || email.body?.content?.substring(0, 100) || '',
          Platform: 'email'
        };
      }));
    } else {
      console.warn('📧 Unknown response structure, trying to extract any events:', res.data);
    }
    
    console.log('📧 Transformed email events:', allEvents);
    return allEvents;
  };

  useEffect(() => {
    fetchAllEvents();
  }, [activeConfig, startDate, endDate]);

  return { events, loading, error, refreshEvents: fetchAllEvents };
};
