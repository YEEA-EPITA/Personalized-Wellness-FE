// ConfigTrelloStep.js
import React from 'react';
import TrelloAccountSelector from './TrelloAccountSelector';
import TrelloBoardListSelector from './TrelloBoardListSelector';
import TrelloCurrentSelections from './TrelloCurrentSelections';

const ConfigTrelloStep = ({
  allAccounts,
  allAccountsLoading,
  selectedTrelloAccount,
  handleTrelloAccountSelect,
  trelloBoards,
  trelloBoardsLoading,
  trelloBoardsError,
  isListSelected,
  handleTrelloBoardListSelect,
  config
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TrelloAccountSelector
        allAccounts={allAccounts}
        selectedTrelloAccount={selectedTrelloAccount}
        handleTrelloAccountSelect={handleTrelloAccountSelect}
        allAccountsLoading={allAccountsLoading}
      />


      <TrelloBoardListSelector
        selectedTrelloAccount={selectedTrelloAccount}
        trelloBoards={trelloBoards}
        trelloBoardsLoading={trelloBoardsLoading}
        trelloBoardsError={trelloBoardsError}
        isListSelected={isListSelected}
        handleTrelloBoardListSelect={handleTrelloBoardListSelect}
      />

      <TrelloCurrentSelections config={config} />
    </div>
  );
};

export default ConfigTrelloStep;
