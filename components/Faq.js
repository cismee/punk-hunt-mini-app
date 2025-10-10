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
                Punk HUNT is a PvP onchain NFT game inspired by Nintendo's Duck Hunt. Players compete to be
                the last <a className="underline text-black" href="#duckmint">Duck</a> holder standing while hunting for <strong>Top Shot</strong> (most eliminations).
              </p><br />
              <p className="faq">Mint <a className="underline text-black" href="#duckmint">Ducks</a>, receive <a className="underline text-black" href="#zappmint">Zappers</a>.</p><br />
              <p className="faq">Burn <a className="underline text-black" href="#zappmint">Zappers</a> to <a className="underline text-black" href="#burn">shoot ducks</a>.</p><br />
              <p className="faq">Ded ducks get burned, and pepe appears.</p><br />
              <p className="faq"><a className="underline text-black" href="#burn">Hunting SZN</a> ends when one <a className="underline text-black" href="#duckmint">Duck</a> holder remains.</p>
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
                <a className="underline text-black" href="https://base.org">Base Mainnnet</a>
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
                The objective: mint ducks and receive <a className="underline text-black" href="#zappmint">Zappers</a>, <a className="underline text-black" href="#burn">shoot ducks</a> by burning{' '}<a className="underline text-black" href="#zappmint">Zappers</a>.<br /><br />
                The game ends when one <a className="underline text-black" href="#duckmint">Duck</a> holder remains. <br /><br />The Last 3 <a className="underline text-black" href="#duckmint">Duck</a> Holders Standing and Top Shot (most hits) receive{' '}<strong>blue-chip NFTs</strong> representing up to <strong>50% of the mint funds</strong>.
              </p><br />
              <p className="faq">
                It's like &quot;<a className="underline text-black" href="https://en.wikipedia.org/wiki/King_of_the_hill_(game)">king-of-the-hill</a>&quot; with a non-fungible twist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Not a collectible */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">So it's not a collectible?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Correct. This is an <strong>NFT game</strong>, not a static collectible. The NFTs are meant to be used. <a className="underline text-black" href="#duckmint">Ducks</a> and <a className="underline text-black" href="#zappmint">Zappers</a> are Open Editions designed to be burned during gameplay.<br /><br />When the game ends, only one <a className="underline text-black" href="#duckmint">Duck</a> holder remains standing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Edition */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What's an Open Edition? How long can I mint?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Open Edition means unlimited supply during the mint window.
              </p>
              <br />
              <p className="faq">
                <a className="underline text-black" href="#duckmint">Ducks</a> 5-day mint window (100 max per wallet)
              </p>
              <p className="faq">
                <a className="underline text-black" href="#zappmint">Zappers</a> Available throughout the entire game, no mint limit.
              </p>
              <br />
              <p className="faq">
                <a className="underline text-black" href="#burn">Hunting SZN</a> begins on Day 3, so mint early if you want to survive!
              </p>
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
              <p className="faq">When <a className="underline text-black" href="#burn">Hunting SZN</a> begins, as shown on the website, <a className="underline text-black" href="https://basescan.org/address/0x831d0CC6fb4bDa004D2d49342085e5299A9B782B">onchain</a>, and announced on <a className="underline text-black" href="https://x.com/cartyisme">Twitter</a>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why shoot zappers */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Why should I shoot Zappers?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Because passive holders are sitting <a className="underline text-black" href="#duckmint">Ducks</a>.
              </p>
              <br />
              <p className="faq">
                The math is simple: when you <a className="underline text-black" href="#burn">shoot ducks</a>, there's only a &gt;1% chance of hitting your own <a className="underline text-black" href="#duckmint">Duck</a>. That means 99%+ of your shots eliminate the competition while your <a className="underline text-black" href="#duckmint">Ducks</a> remain safe.
              </p>
              <br />
              <p className="faq">
                Active hunters control the game. Passive holders pray. Choose wisely.
              </p>
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
                You don't pick. Each Zap fires at a random <a className="underline text-black" href="#duckmint">Duck</a> for fairness. Sometimes you miss, sometimes you hit. Be wary of friendly fire. Your hit rate decreases as fewer <a className="underline text-black" href="#duckmint">Ducks</a> remain alive.
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
                Zaps are burned. Whether you hit or miss. Each shot costs one <a className="underline text-black" href="#zappmint">Zapper</a> permanently.
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
                Yes, friendly fire is possible but, as mentioned above, rare.
              </p>
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
                Your call. <strong>Hodl and hope</strong>, or join the <a className="underline text-black" href="#burn">Hunt</a> and mint extra <a className="underline text-black" href="#zappmint">Zappers</a>.<br /><br /> Eliminate <a className="underline text-black" href="#duckmint">Ducks</a> to climb the <a className="underline text-black" href="#stats">leaderboad</a> and compete for Top Shot.
              </p>
              <br />
              <p className="faq">
                Remember: Each <a className="underline text-black" href="#duckmint">Duck</a> mint includes one free <a className="underline text-black" href="#zappmint">Zapper</a> to get you started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What happens when shot */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What happens when a Duck get shot?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Your <a className="underline text-black" href="#duckmint">Duck</a> gets <strong>rekt</strong>. The NFT is burned and its image changes to show it's eliminated. No respawns, no second chances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* See hits */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">When I hunt, can I see what I hit?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Yes. The UI shows your recent hits. You can also verify on BaseScan, at the linked tx, or watch activity unfold in the trollbox.
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
                Until one <a className="underline text-black" href="#duckmint">Duck</a> holder remains. Could be hours, days, or weeks depending on participation and elimination activity.
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
                Yes. Winners split up to 50% of all mint funds in blue-chip NFTs:
              </p>
              <br />
              <p className="faq">
                <strong><a className="underline text-black" href="#duckmint">Duck</a> PRIZE POOL (50% of Duck mint revenue):</strong>
              </p>
              <p className="faq">
                - Last <a className="underline text-black" href="#duckmint">Duck</a> Standing: 50%
              </p>
              <p className="faq">
                - 2nd Place: 30%
              </p>
              <p className="faq">
                - 3rd Place: 20%
              </p>
              <br />
              <p className="faq">
                <strong>HUNTER PRIZE POOL (50% of <a className="underline text-black" href="#zappmint">Zapper</a> mint revenue):</strong>
              </p>
              <p className="faq">
                - Top Shot (Most Kills): 100%
              </p>
              <br />
              <p className="faq">
                Prize quality scales with participation. Track your standing on the{' '}<a className="underline text-black" href="#stats">leaderboard</a>. It updates in real-time as the carnage unfolds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bluechip NFTs */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">What are blue-chip NFTs?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                Blue-chip NFTs are established collections with sustained demand and liquidity.
              </p>
              <br />
              <p className="faq">
                Prize quality scales with the total prize pool. More players = bigger pool = better prizes. Invite your friends!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prize pool amount */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">How much ETH is in the prize pool?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                The <a className="underline text-black" href="#duckmint">Duck</a> and <a className="underline text-black" href="#zappmint">Zapper</a> prize pool are listed under their corresponding mint pages, onchain, and on the <a className="underline text-black" href="#stats">leaderboad</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Where paid */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Where do I get paid?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                You'll be paid at the wallet address corresponding to the winners onchain, denoted at the Contract Address.
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
                No refunds. Once you mint, you're committed to the game.
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

      {/* Roadmap */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-4xl px-2">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Roadmap?</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="faq">
                A memecoin? Round 2? Time will tell. Follow us on X to stay current.
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