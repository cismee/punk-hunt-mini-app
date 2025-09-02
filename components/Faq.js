// components/Faq.js
import React from 'react';

function Faq() {
  return (
    <div className="faq pt-2 pb-4 text-black" id="faq" style={{ backgroundColor: '#97e500' }}>
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            <h1 className="pt-4 pb-4 text-xl sm:text-2xl lg:text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
        </div>
      </div>

      {/* What is this? */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What is this?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                <strong>Punk HUNT</strong> is a PvP onchain NFT game inspired by Nintendo&apos;s Duck Hunt. Players compete to be
                the <strong>last duck standing</strong> while hunting for <strong>Top Shot</strong> (most eliminations).
              </p>
              <p className="faq">Burn <a className="underline text-black" href="#zappmint">Zappers</a> to zap Ducks.</p>
              <p className="faq">Eliminated ducks get <strong>burned</strong>, and pepe appears.</p>
              <p className="faq">The hunt ends when <strong>one Duck</strong> remains.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What blockchain */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What blockchain is this on?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Base mainnet. All transactions cost real ETH. No testnets, no fake money.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What is a PvP NFT Game? */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What is a PvP NFT Game?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                &quot;PvP&quot; stands for &quot;Player versus Player.&quot; Punk HUNT is an elimination NFT game.
              </p>
              <p className="faq">
                The objective: mint ducks and receive zappers, shoot Ducks by burning{' '}
                <a className="underline text-black" href="#zappmint">Zappers</a>.
                The game ends when one Duck remains. The Top 3 Last Ducks Standing and Top Shot (most hits) receive{' '}
                <strong>blue-chip NFTs</strong> representing up to <strong>50% of the mint funds</strong>.
              </p>
              <p className="faq">
                It&apos;s like &quot;<a className="underline text-black" href="https://en.wikipedia.org/wiki/King_of_the_hill_(game)" target="_blank" rel="noopener noreferrer">king-of-the-hill</a>&quot; with a non-fungible twist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Not a collectible */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">So it&apos;s not a collectible?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Correct. This is an <strong>NFT game</strong>, not a static collectible. It&apos;s <strong>anti-collectible</strong> - your NFT will
                likely be burned. When the game completes, only one NFT remains.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What happens when shot */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What happens when I get shot?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Your Duck gets <strong>rekt</strong> - the NFT is burned and its image changes to show it&apos;s eliminated. No respawns, no second chances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game duration */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">How long does the game last?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Until mathematical elimination. Could be hours, days, or weeks depending on participation and elimination activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* No refunds */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Can I withdraw if I change my mind?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                No refunds. Once you mint, you&apos;re committed to the game.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discord */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Do you have a Discord?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">No official server. But feel free to chat in the trollbox on the website.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Minted a Duck */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">I minted a Duck, now what?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Your call. <strong>Hodl and hope</strong>, or <strong>join the hunt</strong> by minting/burning Zappers. Eliminate
                 Ducks to climb the leaderboard. Each Duck Mint comes with a free zapper.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mint limits */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Mint limits?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq"><strong>Ducks:</strong> None. Mint as many as you want.</p>
              <p className="faq"><strong>Zappers:</strong> No cap. Fire as many as you like.</p>
            </div>
          </div>
        </div>
      </div>

      {/* When shooting starts */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">When can I start shooting?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">When <strong>Hunting SZN</strong> begins, as denoted on the website and onchain.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Targeting */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">How are targets chosen?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                You don&apos;t pick. Each Zap fires at a <strong>random Duck</strong> for fairness. Sometimes you miss, sometimes you hit.
                Your hit rate decreases as fewer Ducks remain alive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zapper consumption */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What happens to my Zappers when I shoot?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Zaps are burned. Whether you hit or miss. Each shot costs one Zapper permanently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kamikaze */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Can I shoot my own Ducks?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Yes, but eliminating your own ducks doesn&apos;t increase your kill count.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* See hits */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Can I see what I hit?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Yes. The UI shows your recent hits; you can also verify on BaseScan, or watch activity unfold in the trollbox.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ded check */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">How do I know if my Duck is eliminated?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                When it&apos;s burned. Your Duck&apos;s image and traits will flip to <strong>rekt</strong>, and the transaction shows the elimination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Do I get rewarded if I win?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Yes. <strong>The Top Shot</strong> (most hits) and <strong>3 Last Ducks Standing</strong> (final surviving Ducks) each receive
                <strong> blue-chip NFTs</strong> representing up to <strong>50% of the mint funds</strong>. Track standings and prize pool on the{' '} 
                <a className="underline text-black" href="#stats"> leaderboard</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Where do I get paid?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                You&apos;ll be paid at the wallet address corresponding to the winners onchain, and denoted @ the CA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Roadmap?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                A memecoin!? Round 2!? Time will tell. Follow us on X to stay current.
              </p>
              <div className="py-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;