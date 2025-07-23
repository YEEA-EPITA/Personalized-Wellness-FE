import React, { useState, useCallback } from 'react';
import { getRequest, postRequest } from '@/shared/utils/requests';
import { SERVERS } from '@/shared/constants/general';
import ConfigTrelloStep from './ConfigTrelloStep';

const ConfigModalTrelloTab = ({ config, setConfig, googleAccounts, googleAccountsLoading, googleAccountsError }) => {
  const [selectedTrelloAccount, setSelectedTrelloAccount] = useState(null);
  const [trelloBoards, setTrelloBoards] = useState({});
  const [trelloBoardsLoading, setTrelloBoardsLoading] = useState(false);
  const [trelloBoardsError, setTrelloBoardsError] = useState(null);

  const safeGoogleAccounts = Array.isArray(googleAccounts) ? googleAccounts : [];
  const filteredTrelloAccounts = safeGoogleAccounts.filter(account => account.type === 'TRELLO');
  const allAccounts = filteredTrelloAccounts;
  const allAccountsLoading = googleAccountsLoading;


  const fetchTrelloBoards = useCallback(async (trelloEmail) => {
    console.log('🔍 Fetching Trello boards for:', trelloEmail);
    setTrelloBoardsLoading(true);
    setTrelloBoardsError(null);

    try {
      console.log('📡 Getting all boards for account:', trelloEmail);
      const response = await getRequest({ server: SERVERS.java.value })({
        endpoint: `/trello/boards?trelloEmail=${encodeURIComponent(trelloEmail)}`
      });

      console.log('✅ Trello boards response:', response.data);
      const boards = Array.isArray(response.data?.body) ? response.data.body : Array.isArray(response.data) ? response.data : [];
      console.log('📋 All boards received:', boards);

      if (boards.length === 0) {
        console.warn('⚠️ No boards found for account');
        setTrelloBoards(prev => ({ ...prev, [trelloEmail]: [] }));
        return;
      }

      const boardIds = boards.map(board => board.id);
      console.log('📊 Board IDs:', boardIds);

      try {
        const listsResponse = await postRequest({ server: SERVERS.java.value })({
          endpoint: '/trello/lists',
          payload: {
            trelloEmail: trelloEmail,
            boardIds: boardIds
          }
        });

        console.log('✅ All lists response:', listsResponse.data);
        const allLists = Array.isArray(listsResponse.data?.body) ? listsResponse.data.body : Array.isArray(listsResponse.data) ? listsResponse.data : [];

        const listsByBoard = listsResponse.data?.body || listsResponse.data || {};
        console.log('📋 All lists received:', allLists);

        const boardsWithLists = boards.map(board => ({
          ...board,
          lists: listsByBoard[board.id] || []
        }));

        console.log(boardsWithLists);

        console.log('📊 Final boards with lists:', boardsWithLists);
        setTrelloBoards(prev => ({ ...prev, [trelloEmail]: boardsWithLists }));

      } catch (listsError) {
        console.error('❌ Error fetching lists for all boards:', listsError);
        const boardsWithoutLists = allBoards.map(board => ({
          ...board,
          lists: [],
          error: 'Failed to load lists'
        }));
        setTrelloBoards(prev => ({ ...prev, [trelloEmail]: boardsWithoutLists }));
      }

    } catch (error) {
      console.error('❌ Error fetching Trello boards:', error);
      setTrelloBoardsError(error.message);
      setTrelloBoards(prev => ({ ...prev, [trelloEmail]: [] }));
    } finally {
      setTrelloBoardsLoading(false);
    }
  }, []);

const handleTrelloAccountSelect = useCallback(async (accountEmail) => {
  console.log('🎯 Trello account selected:098', accountEmail);

  // avoid refetching if already selected
  if (accountEmail === selectedTrelloAccount) {
    console.log('🎯 Account already selected, skipping...');
    return;
  }

  setSelectedTrelloAccount(accountEmail);

  // only fetch if not already fetched
  if (!trelloBoards[accountEmail]) {
    console.log('🎯 Fetching boards for new account:', accountEmail);
    await fetchTrelloBoards(accountEmail);
  } else {
    console.log('🎯 Boards already fetched for account:', accountEmail);
  }
}, [fetchTrelloBoards, selectedTrelloAccount, trelloBoards, allAccounts]);


const handleTrelloBoardListSelect = useCallback((accountEmail, board, list) => {
  console.log('📋 Trello board/list selected:', { accountEmail, boardName: board.name, listName: list.name });
  
  setConfig(prev => {
    const existingSelections = prev.trello?.selections || [];
    console.log('📋 Current selections before update:', existingSelections.map(s => ({ 
      account: s.account, 
      board: s.board?.name, 
      list: s.list?.name 
    })));

    // Check if selection already exists
    const alreadySelected = existingSelections.some(s =>
      s.account === accountEmail &&
      s.board?.id === board.id &&
      s.list?.id === list.id
    );

    console.log('📋 Is already selected?', alreadySelected);

    // Remove if already selected, else add it
    const updatedSelections = alreadySelected
      ? existingSelections.filter(s =>
          !(s.account === accountEmail &&
            s.board?.id === board.id &&
            s.list?.id === list.id))
      : [...existingSelections, {
          account: accountEmail,
          board: { id: board.id, name: board.name },
          list: { id: list.id, name: list.name }
        }];

    console.log('📋 Updated selections:', updatedSelections.map(s => ({ 
      account: s.account, 
      board: s.board?.name, 
      list: s.list?.name 
    })));

    return {
      ...prev,
      trello: {
        selections: updatedSelections
      }
    };
  });
}, [setConfig]);


  const isListSelected = useCallback((accountEmail, board, list) => {
    const selections = config?.trello?.selections || [];
    return selections.some(s =>
      s.account === accountEmail &&
      s.board?.id === board.id &&
      s.list?.id === list.id
    );
  }, [config]);

  return (
    <ConfigTrelloStep
      allAccounts={allAccounts}
      allAccountsLoading={allAccountsLoading}
      selectedTrelloAccount={selectedTrelloAccount}
      handleTrelloAccountSelect={handleTrelloAccountSelect}
      trelloBoards={trelloBoards[selectedTrelloAccount] || []}
      trelloBoardsLoading={trelloBoardsLoading}
      trelloBoardsError={trelloBoardsError}
      isListSelected={isListSelected}
      handleTrelloBoardListSelect={handleTrelloBoardListSelect}
      config={config}
    />
  );
};

export default ConfigModalTrelloTab;
