onst CustomConnectWallet = ({ isMobile }) => {
  return (
    <div className="custom-connect-wallet">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={`bg-pink-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors`}
                    >
                      <FaWallet className={`${isMobile ? 'mr-1' : 'mr-2'}`} />
                      {isMobile ? 'Connect' : 'Connect Wallet'}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={`bg-red-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center`}
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={`bg-pink-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors`}
                  >
                    {isMobile 
                      ? `${account.displayName.slice(0, 4)}...${account.displayName.slice(-4)}`
                      : `${account.displayName} ${account.displayBalance ? `(${account.displayBalance})` : ''}`
                    }
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};
