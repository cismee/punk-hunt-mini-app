import React, { useState } from 'react';
import './Terms.css';

function Terms() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="splash pt-2 terms" id="terms">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <h1 className="pt-4">Terms of Service</h1>
                            <button 
                type="button" 
                className="nes-btn is-primary mx-4" 
                onClick={handleShowModal}
              >
                View Full Terms of Service
              </button>

              <p className="p-4 m-2">
                <i className="nes-icon is-small heart"></i>&#160;fuck the police&#160;<i className="nes-icon is-small heart"></i>
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div 
        className={`modal fade ${showModal ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ display: showModal ? 'block' : 'none' }}
        aria-labelledby="termsModalLabel" 
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content nes-container with-title">
            <div className="modal-header">
              <h3 className="title">Terms of Service - Punk HUNT</h3>
              <button 
                type="button" 
                className="nes-btn is-error" 
                onClick={handleCloseModal}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="nes-container is-dark" style={{ padding: '20px', fontSize: '14px', lineHeight: '1.4' }}>
                
                <h2>TERMS OF SERVICE</h2>
                <p><strong>Punk HUNT NFT Game</strong></p>
                <p><strong>Last Updated: 8/31/2025</strong></p>
                <p><strong>PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING THE PUNK HUNT NFT GAME APPLICATION. BY ACCESSING OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS.</strong></p>

                <h3>1. ACCEPTANCE OF TERMS AND AGREEMENT FORMATION</h3>
                <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and [COMPANY NAME] ("Company," "we," "us," or "our"), a California-based entity, governing your use of the Punk HUNT NFT game application, website, and related services (collectively, the "Service").</p>

                <h4>1.1 Multiple Forms of Agreement</h4>
                <p><strong>BY ANY OF THE FOLLOWING ACTIONS, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS:</strong></p>
                <ul>
                  <li>Accessing, downloading, installing, or using our Service in any manner</li>
                  <li>Clicking any button on our website or application</li>
                  <li>Interacting with any smart contract connected to our website</li>
                  <li>Connecting your wallet to our Service</li>
                  <li>Attempting to mint, purchase, or transfer any NFTs or tokens through our Service</li>
                  <li>Viewing NFT metadata or game statistics on our platform</li>
                  <li>Participating in any aspect of the Punk HUNT game</li>
                  <li>Using any feature, tool, or functionality provided by the Service</li>
                </ul>

                <h4>1.2 Express Waiver and Forfeiture of Claims</h4>
                <p><strong>CRITICAL LEGAL ACKNOWLEDGMENT</strong>: By taking any action described in Section 1.1 above, you expressly and irrevocably:</p>
                <ul>
                  <li><strong>WAIVE AND FORFEIT</strong> any and all rights to seek recompense, compensation, refunds, damages, or any other form of recovery from us</li>
                  <li><strong>RELEASE ALL CLAIMS</strong> against us of any nature, whether known or unknown, existing now or arising in the future</li>
                  <li><strong>ASSUME FULL FINANCIAL RISK</strong> for all consequences of your interaction with the Service</li>
                  <li><strong>ACKNOWLEDGE TOTAL LOSS PROBABILITY</strong> and accept that outcome without any right to recovery</li>
                </ul>

                <p><strong>NO EXCEPTIONS</strong>: This waiver and forfeiture applies regardless of the cause of loss, including but not limited to our negligence, smart contract failures, technical errors, or any other circumstances.</p>

                <p>If you do not agree to these Terms and this complete waiver of recompense rights, you must not take any of the actions listed in Section 1.1 and must immediately cease all use of the Service.</p>

                <h3>2. DESCRIPTION OF SERVICE</h3>
                <p>Punk HUNT is a blockchain-based PvP NFT game inspired by Nintendo's Duck Hunt, built on Base mainnet, featuring:</p>
                <ul>
                  <li><strong>Duck NFTs</strong>: ERC-721 tokens representing game characters that can be "zapped" (eliminated) by other players</li>
                  <li><strong>Zapper Tokens</strong>: ERC-1155 utility tokens used to eliminate other players' Duck NFTs through random targeting</li>
                  <li><strong>Player vs Player Gameplay</strong>: Anti-collectible elimination game where players compete to be the last Duck standing</li>
                  <li><strong>Leaderboards</strong>: Tracking "Top Shot" (most eliminations) and "Last Ducks Standing" (survivors)</li>
                  <li><strong>Prize Pool System</strong>: Winners receive blue-chip NFTs representing up to 50% of mint funds</li>
                  <li><strong>Real-Time Onchain Interactions</strong>: All game actions recorded permanently on Base blockchain</li>
                  <li><strong>No Respawns</strong>: Once eliminated, Duck NFTs are permanently burned with no restoration possible</li>
                </ul>

                <p><strong>Game Objective</strong>: Mint Ducks and receive Zappers, shoot Ducks by burning Zappers to eliminate other players. The game ends when one Duck remains. This is an <strong>anti-collectible</strong> NFT game where your NFT will likely be burned during gameplay.</p>

                <p>The Service includes a React-based web application interface for interacting with smart contracts deployed on Base mainnet using real ETH for all transactions.</p>

                <h3>3. ELIGIBILITY AND AGE REQUIREMENTS</h3>
                
                <h4>3.1 Age Requirements</h4>
                <p>You must be at least 18 years old to use this Service. If you are between 13 and 18 years old, you may only use the Service with the involvement and consent of a parent or guardian.</p>

                <h4>3.2 Legal Capacity and Financial Acknowledgments</h4>
                <p>You represent and warrant that you:</p>
                <ul>
                  <li>Have the legal capacity to enter into these Terms</li>
                  <li>Understand this is high-risk entertainment that may result in total financial loss</li>
                  <li>Are participating with funds you can afford to lose entirely</li>
                  <li>Have consulted appropriate advisors if needed regarding the financial and legal implications</li>
                  <li>Understand your use of the Service will not violate any applicable law or regulation</li>
                  <li>Acknowledge this Service may constitute gambling in some jurisdictions and you are responsible for compliance with your local laws</li>
                </ul>

                <h4>3.3 Prohibited Jurisdictions</h4>
                <p>The Service may not be available in all jurisdictions. You are responsible for ensuring that your use of the Service complies with applicable local laws and regulations.</p>

                <h3>4. BLOCKCHAIN AND CRYPTOCURRENCY RISKS</h3>

                <h4>4.1 Blockchain Technology Risks</h4>
                <p>You expressly acknowledge, understand, and voluntarily assume all risks associated with blockchain technology, including but not limited to:</p>
                <ul>
                  <li><strong>Volatility</strong>: Cryptocurrency and NFT values are extremely volatile and unpredictable, and you may lose your entire investment</li>
                  <li><strong>Technical Risks</strong>: Smart contract bugs, exploits, network congestion, technical failures, and protocol changes beyond our control</li>
                  <li><strong>Irreversible Transactions</strong>: Blockchain transactions are generally irreversible and we cannot reverse, cancel, or refund any transactions</li>
                  <li><strong>Regulatory Uncertainty</strong>: Rapidly evolving regulatory landscape that may affect digital assets, NFTs, or blockchain gaming</li>
                  <li><strong>Loss of Private Keys</strong>: You are solely responsible for securing your wallet and private keys; lost keys result in permanent loss of assets</li>
                  <li><strong>Network Dependencies</strong>: Our Service depends entirely on blockchain infrastructure we do not control</li>
                  <li><strong>Experimental Technology</strong>: Blockchain technology is experimental and may contain unknown risks or failures</li>
                </ul>

                <p><strong>YOU EXPRESSLY WAIVE ANY CLAIMS AGAINST US FOR LOSSES RESULTING FROM THESE INHERENT BLOCKCHAIN RISKS.</strong></p>

                <h4>4.2 Base Mainnet Specific Risks</h4>
                <p>All transactions occur on Base mainnet using real ETH. You acknowledge:</p>
                <ul>
                  <li><strong>Real Financial Stakes</strong>: All minting, zapping, and game activities involve real ETH transactions with actual financial value</li>
                  <li><strong>No Testnets</strong>: This is not a test environment - all costs and losses are permanent and real</li>
                  <li><strong>Gas Fees</strong>: You are responsible for all Base network transaction fees required for gameplay</li>
                  <li><strong>Network Dependencies</strong>: Game functionality depends on Base network availability and performance</li>
                </ul>

                <h4>4.3 No Investment Advice</h4>
                <p>The Service is provided for entertainment purposes. Nothing in these Terms or on our Service constitutes investment, financial, legal, or tax advice. You should consult with appropriate professionals before making any decisions regarding digital assets.</p>

                <h3>5. NFT OWNERSHIP AND GAME MECHANICS</h3>

                <h4>5.1 NFT Ownership</h4>
                <p>When you purchase or mint Duck NFTs or Zapper tokens through our Service:</p>
                <ul>
                  <li>You own the NFT as recorded on the blockchain</li>
                  <li>Ownership is subject to the smart contract terms and blockchain network rules</li>
                  <li>We do not custody or control your NFTs - they are held in your connected wallet</li>
                </ul>

                <h4>5.2 Game Mechanics and Elimination</h4>
                <p>By participating in Punk HUNT, you understand and accept that:</p>
                <ul>
                  <li><strong>Duck NFTs WILL LIKELY BE BURNED</strong> - This is an anti-collectible game where elimination is the expected outcome</li>
                  <li><strong>Random Targeting System</strong> - You cannot choose specific targets; each Zapper fires at a random Duck for fairness</li>
                  <li><strong>No Guaranteed Hits</strong> - You may miss targets, especially as fewer Ducks remain alive</li>
                  <li><strong>Elimination is Permanent and Irreversible</strong> - Zapped Ducks cannot be restored, respawned, or recovered</li>
                  <li><strong>No Mint Limits</strong> - You may mint unlimited Ducks and Zappers at your own risk and expense</li>
                  <li><strong>Zappers are Consumed</strong> - Each shot burns a Zapper whether you hit or miss</li>
                  <li><strong>Self-Elimination Possible</strong> - You may accidentally eliminate your own Ducks, but this doesn't count toward your kill score</li>
                  <li><strong>Hunting Season Requirements</strong> - Zapping only begins when "Hunting SZN" is activated onchain</li>
                  <li><strong>Game Duration Uncertainty</strong> - Games last until mathematical elimination (hours, days, or weeks)</li>
                  <li><strong>Leaderboard Participation</strong> is automatic when you hold Duck NFTs or use Zapper tokens</li>
                </ul>

                <h4>5.3 Comprehensive No Refunds and No Liability Policy</h4>
                <p><strong>ABSOLUTE NO REFUNDS, NO LIABILITY, NO EXCEPTIONS</strong>:</p>
                <p>By participating, you irrevocably acknowledge and agree that:</p>
                <ul>
                  <li><strong>ALL TRANSACTIONS ARE FINAL</strong> - No refunds, reversals, credits, or compensation under any circumstances</li>
                  <li><strong>TOTAL LOSS EXPECTED</strong> - You will likely lose 100% of funds spent on Ducks and Zappers</li>
                  <li><strong>NO LIABILITY FOR LOSSES</strong> - We have zero liability for any financial losses from gameplay, technical issues, or any other cause</li>
                  <li><strong>VOLUNTARY PARTICIPATION</strong> - Your participation is entirely voluntary and at your sole risk</li>
                  <li><strong>NO GUARANTEES</strong> - We provide no guarantees regarding game outcomes, prize distribution, technical performance, or any other aspect of the Service</li>
                  <li><strong>RELEASE OF ALL CLAIMS</strong> - You release us from any and all claims related to your participation, losses, or Service use</li>
                </ul>

                <p>This includes but is not limited to:</p>
                <ul>
                  <li>Eliminated Duck NFTs (intended game mechanic, not compensable damage)</li>
                  <li>Consumed Zapper tokens (intended game mechanic, not compensable damage)</li>
                  <li>All mint costs and transaction fees</li>
                  <li>Self-eliminations, accidents, or user errors</li>
                  <li>Technical failures, network issues, or smart contract problems</li>
                  <li>Prize pool changes, game delays, or cancellation</li>
                  <li>Regulatory changes affecting the game</li>
                  <li>Any other losses or damages of any kind</li>
                </ul>

                <p><strong>YOU EXPRESSLY WAIVE ALL RIGHTS TO SEEK ANY FORM OF COMPENSATION OR LEGAL REMEDY AGAINST US.</strong></p>

                <h4>5.4 Prize Distribution and Winner Rewards</h4>
                <p>By participating, you understand the prize system:</p>
                <ul>
                  <li><strong>Winners Determined by Game Results</strong>: "Top Shot" (most eliminations) and "3 Last Ducks Standing" (final survivors) may potentially receive rewards</li>
                  <li><strong>Prizes Completely at Creator's Discretion</strong>: Any bluechip NFT prizes, rewards, or compensation are entirely at the sole discretion, whim, and decision of the creator/company with no obligation whatsoever</li>
                  <li><strong>No Guaranteed Prizes</strong>: There are absolutely no guaranteed prizes, rewards, or payouts of any kind regardless of game performance or outcome</li>
                  <li><strong>Prize Pool Disclaimer</strong>: Any references to "prize pools" or "50% of mint funds" are aspirational only and create no binding obligation or legal commitment</li>
                  <li><strong>Creator's Absolute Authority</strong>: The creator reserves the absolute right to distribute, withhold, modify, or cancel any and all prizes without notice, justification, or compensation</li>
                  <li><strong>Payment Method</strong>: IF prizes are distributed (entirely at creator's discretion), they would be paid to wallet addresses of winners as determined solely by the creator</li>
                  <li><strong>No Recourse for Non-Payment</strong>: You waive all rights to seek legal remedy, compensation, or damages if prizes are not distributed for any reason or no reason</li>
                </ul>

                <h3>6. INTELLECTUAL PROPERTY RIGHTS</h3>

                <h4>6.1 Our IP Rights</h4>
                <p>The Service, including all software, content, trademarks, and intellectual property (excluding NFT assets), is owned by us and protected by intellectual property laws. Our license to you is limited as described in these Terms.</p>

                <h4>6.2 NFT IP Rights</h4>
                <p>When you own a Duck NFT that has not been eliminated:</p>
                <ul>
                  <li>You have a limited, personal, non-commercial license to display the NFT image</li>
                  <li>You may transfer or sell your NFT according to the smart contract terms</li>
                  <li>We retain all rights not expressly granted to you</li>
                </ul>

                <h4>6.3 User Content</h4>
                <p>You grant us a non-exclusive, royalty-free license to use any content you submit through the Service for operational purposes.</p>

                <h3>7. USER CONDUCT AND PROHIBITED ACTIVITIES</h3>

                <h4>7.1 Acceptable Use</h4>
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You will not:</p>
                <ul>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Attempt to exploit smart contract vulnerabilities or game mechanics</li>
                  <li>Use automated tools, bots, or scripts to gain unfair advantages</li>
                  <li>Engage in market manipulation or wash trading</li>
                  <li>Participate if you cannot afford to lose your entire investment</li>
                  <li>Attempt to manipulate random targeting systems or game outcomes</li>
                </ul>

                <h4>7.2 Smart Contract Interaction and Game Mechanics</h4>
                <p>You understand that interactions with smart contracts are:</p>
                <ul>
                  <li><strong>Automated and irreversible</strong> once confirmed on Base network</li>
                  <li><strong>Subject to network conditions</strong> and potential delays or failures</li>
                  <li><strong>Your sole responsibility</strong> - verify all transactions before confirming</li>
                  <li><strong>Random in targeting</strong> - you cannot control which Ducks are targeted by your Zappers</li>
                  <li><strong>Permanent when eliminating NFTs</strong> - burned Ducks cannot be recovered through any means</li>
                  <li><strong>Visible to all players</strong> - your hits and game activity can be verified on BaseScan and in the application UI</li>
                </ul>

                <h3>8. DISCLAIMERS AND WARRANTIES</h3>

                <h4>8.1 Service Provided "As Is" - Maximum Disclaimer</h4>
                <p>THE SERVICE IS PROVIDED ON AN "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING WITHOUT LIMITATION:</p>
                <ul>
                  <li>MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT</li>
                  <li>ACCURACY, COMPLETENESS, RELIABILITY, OR TIMELINESS OF ANY INFORMATION</li>
                  <li>UNINTERRUPTED, SECURE, OR ERROR-FREE OPERATION</li>
                  <li>FREEDOM FROM VIRUSES, MALWARE, OR HARMFUL CODE</li>
                  <li>COMPATIBILITY WITH YOUR HARDWARE, SOFTWARE, OR NETWORK</li>
                  <li>ACCURACY OF RANDOM TARGETING SYSTEMS OR GAME OUTCOMES</li>
                  <li>GAME COMPLETION, DURATION, OR PRIZE DISTRIBUTION</li>
                  <li>PRESERVATION OF NFT VALUE, CHARACTERISTICS, OR EXISTENCE</li>
                  <li>SMART CONTRACT FUNCTIONALITY OR BLOCKCHAIN NETWORK PERFORMANCE</li>
                </ul>

                <p><strong>WE MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE SERVICE WHATSOEVER AND DISCLAIM ALL IMPLIED WARRANTIES TO THE MAXIMUM EXTENT PERMITTED BY LAW.</strong></p>

                <h4>8.2 Comprehensive Liability Disclaimers</h4>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL LIABILITY FOR:</p>
                <ul>
                  <li>Smart contract functionality, bugs, exploits, or performance failures</li>
                  <li>Base network failures, congestion, downtime, or protocol changes</li>
                  <li>Loss, theft, or compromise of digital assets from any cause</li>
                  <li>Regulatory changes, enforcement actions, or legal restrictions affecting digital assets</li>
                  <li>Third-party wallet providers, exchanges, or service failures</li>
                  <li>Hacking, phishing, or security breaches of any kind</li>
                  <li>Random targeting outcomes, hit/miss results, or game mechanics</li>
                  <li>Game duration, completion timing, delays, or cancellation</li>
                  <li>NFT eliminations, burns, or any gameplay outcomes</li>
                  <li>Prize pool fluctuations, distribution delays, or non-payment</li>
                  <li>Self-elimination or targeting of your own NFTs</li>
                  <li>User errors, misunderstandings, or accidental transactions</li>
                  <li>Technical compatibility issues with your devices or software</li>
                  <li>Internet connectivity problems or network failures</li>
                  <li>Any act of God, force majeure, or circumstances beyond our control</li>
                </ul>

                <p><strong>WE ASSUME NO RESPONSIBILITY OR LIABILITY WHATSOEVER FOR ANY ASPECT OF THE SERVICE OR YOUR PARTICIPATION.</strong></p>

                <h4>8.3 California-Specific Disclaimers</h4>
                <p>CALIFORNIA RESIDENTS HAVE CERTAIN RIGHTS UNDER CALIFORNIA CIVIL CODE SECTION 1542, WHICH STATES: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE AND THAT, IF KNOWN BY HIM OR HER, WOULD HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR OR RELEASED PARTY."</p>

                <p>NOTWITHSTANDING THIS PROVISION, YOU HEREBY WAIVE ALL RIGHTS UNDER SECTION 1542 TO THE FULLEST EXTENT PERMITTED BY LAW.</p>

                <h3>9. ABSOLUTE LIMITATION OF LIABILITY</h3>

                <h4>9.1 Maximum Liability Limitations</h4>
                <p>TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS, DAMAGES, LOSSES, AND CAUSES OF ACTION (WHETHER IN CONTRACT, TORT, INCLUDING NEGLIGENCE, OR OTHERWISE) ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE LESSER OF:</p>
                <ul>
                  <li><strong>FIFTY DOLLARS ($50.00 USD)</strong></li>
                  <li><strong>THE TOTAL AMOUNT YOU PAID TO US IN THE THIRTY (30) DAYS PRECEDING THE EVENT GIVING RISE TO LIABILITY</strong></li>
                </ul>

                <h4>9.2 Exclusion of Damages</h4>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY:</p>
                <ul>
                  <li><strong>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES</strong></li>
                  <li><strong>LOSS OF PROFITS, REVENUE, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES</strong></li>
                  <li><strong>BUSINESS INTERRUPTION OR COMMERCIAL DAMAGES</strong></li>
                  <li><strong>PERSONAL INJURY, PROPERTY DAMAGE, OR EMOTIONAL DISTRESS</strong></li>
                  <li><strong>LOSS OF DIGITAL ASSETS THROUGH ANY MEANS INCLUDING GAMEPLAY, TECHNICAL FAILURES, OR THIRD-PARTY ACTIONS</strong></li>
                  <li><strong>NFT ELIMINATIONS, BURNS, OR GAME-RELATED LOSSES OF ANY KIND</strong></li>
                  <li><strong>FAILED TRANSACTIONS, MISSED OPPORTUNITIES, OR TIMING-RELATED LOSSES</strong></li>
                  <li><strong>DAMAGES ARISING FROM SMART CONTRACT BUGS, EXPLOITS, OR BLOCKCHAIN NETWORK ISSUES</strong></li>
                </ul>

                <h4>9.3 Game-Specific Liability Exclusions</h4>
                <p><strong>CRITICAL ACKNOWLEDGMENT</strong>: You expressly acknowledge and agree that:</p>
                <ul>
                  <li><strong>NFT ELIMINATION IS NOT DAMAGES</strong> - The burning/elimination of Duck NFTs is the intended game mechanic, not compensable harm</li>
                  <li><strong>ZAPPER CONSUMPTION IS NOT DAMAGES</strong> - The burning of Zapper tokens is the intended game mechanic, not compensable harm</li>
                  <li><strong>FINANCIAL LOSS IS EXPECTED</strong> - Total loss of all funds is the statistically likely outcome for most players</li>
                  <li><strong>NO LIABILITY FOR GAME OUTCOMES</strong> - We have zero liability for any game results, eliminations, misses, or failures to win</li>
                  <li><strong>VOLUNTARY HIGH-RISK ACTIVITY</strong> - Your participation constitutes voluntary assumption of extreme financial risk</li>
                </ul>

                <p><strong>THESE LIMITATIONS APPLY EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND EVEN IF ANY LIMITED REMEDY FAILS OF ITS ESSENTIAL PURPOSE.</strong></p>

                <h4>9.4 California Consumer Rights</h4>
                <p>SOME STATES, INCLUDING CALIFORNIA, DO NOT ALLOW THE LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY, AND YOU MAY HAVE ADDITIONAL RIGHTS.</p>

                <h3>10. COMPREHENSIVE INDEMNIFICATION</h3>
                <p>You agree to indemnify, defend, and hold completely harmless the Company, its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, demands, suits, proceedings, damages, losses, costs, liabilities, and expenses (including reasonable attorney fees and court costs) arising from or relating to:</p>
                <ul>
                  <li>Your access to or use of the Service in any manner</li>
                  <li>Your participation in Punk HUNT gameplay and any related activities</li>
                  <li>Your violation of these Terms or any applicable law or regulation</li>
                  <li>Your violation of any third-party rights, including intellectual property rights</li>
                  <li>Your blockchain transactions, NFT activities, and digital asset management</li>
                  <li>Any losses incurred through normal or abnormal gameplay mechanics</li>
                  <li>Claims related to NFT eliminations, Zapper consumption, or prize disputes</li>
                  <li>Technical issues with your wallet, internet connection, devices, or software</li>
                  <li>Your failure to understand game mechanics, risks, or Terms before participating</li>
                  <li>Any content or information you submit through the Service</li>
                  <li>Your negligent acts, omissions, or misconduct</li>
                  <li>Any breach of your representations and warranties in these Terms</li>
                  <li>Any third-party claims against us arising from your use of the Service</li>
                  <li>Any regulatory investigations or enforcement actions related to your activities</li>
                  <li>Any tax obligations or disputes related to your participation</li>
                </ul>

                <p><strong>This indemnification obligation survives termination of these Terms and applies regardless of whether the claims have merit. You agree to cooperate fully in our defense of any such claims.</strong></p>

                <h3>11. PRIVACY AND DATA COLLECTION</h3>

                <h4>11.1 Privacy Policy</h4>
                <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

                <h4>11.2 California Privacy Rights</h4>
                <p>California residents have specific rights under the California Consumer Privacy Act (CCPA). Please refer to our Privacy Policy for details about your rights and how to exercise them.</p>

                <h4>11.3 Blockchain Transparency</h4>
                <p>Remember that blockchain transactions are public and permanent. Wallet addresses and transaction history may be publicly viewable.</p>

                <h3>12. MODIFICATIONS AND UPDATES</h3>

                <h4>12.1 Terms Updates</h4>
                <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes through the Service or via email. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

                <h4>12.2 Service Updates</h4>
                <p>We may update, modify, or discontinue the Service at any time without prior notice, subject to applicable law.</p>

                <h3>13. TERMINATION</h3>

                <h4>13.1 Termination Rights</h4>
                <p>Either party may terminate your access to the Service at any time. We may suspend or terminate your account for violations of these Terms.</p>

                <h4>13.2 Effect of Termination</h4>
                <p>Upon termination:</p>
                <ul>
                  <li>Your license to use the Service ends immediately</li>
                  <li>You retain ownership of NFTs in your wallet</li>
                  <li>These Terms survive termination where applicable</li>
                </ul>

                <h3>14. DISPUTE RESOLUTION</h3>

                <h4>14.1 Governing Law</h4>
                <p>These Terms are governed by California law without regard to conflict of law principles.</p>

                <h4>14.2 Mandatory Binding Arbitration</h4>
                <p><strong>MANDATORY ARBITRATION CLAUSE - PLEASE READ CAREFULLY</strong></p>

                <p><strong>YOU AGREE THAT ANY AND ALL DISPUTES, CLAIMS, OR CONTROVERSIES ARISING FROM OR RELATING TO THESE TERMS, THE SERVICE, YOUR USE OF THE SERVICE, OR YOUR PARTICIPATION IN PUNK HUNT SHALL BE RESOLVED EXCLUSIVELY THROUGH FINAL AND BINDING ARBITRATION</strong>, rather than in court, except as specified below.</p>

                <p><strong>Arbitration Rules</strong>: Arbitration shall be administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules then in effect, except as modified by these Terms.</p>

                <p><strong>Location</strong>: All arbitrations shall be conducted in [CALIFORNIA CITY], California, regardless of your location.</p>

                <p><strong>Arbitrator Selection</strong>: The arbitration shall be decided by a single arbitrator chosen in accordance with AAA rules.</p>

                <p><strong>Costs</strong>: You are responsible for all arbitration fees and costs unless prohibited by law. In no event shall we be required to pay your fees and costs.</p>

                <p><strong>Discovery and Procedures</strong>: Discovery and procedures shall be limited to minimize time and cost. The arbitrator may limit discovery and shall issue a written decision explaining the basis for the award.</p>

                <p><strong>Remedies</strong>: The arbitrator's authority is limited to resolving the specific dispute and may not consolidate claims or fashion relief affecting other users.</p>

                <p><strong>Exceptions to Arbitration</strong>:</p>
                <ul>
                  <li>Small claims court matters (if they remain in small claims court)</li>
                  <li>Requests for emergency injunctive relief to protect intellectual property</li>
                  <li>Claims we bring against you for violation of these Terms</li>
                </ul>

                <p><strong>WAIVER OF JURY TRIAL</strong>: YOU WAIVE ANY RIGHT TO A JURY TRIAL FOR ANY DISPUTE COVERED BY THIS ARBITRATION CLAUSE.</p>

                <h4>14.3 Class Action and Representative Proceeding Waiver</h4>
                <p><strong>CLASS ACTION WAIVER - CRITICAL PROVISION</strong></p>

                <p><strong>YOU EXPRESSLY WAIVE ANY RIGHT TO PARTICIPATE IN ANY CLASS ACTION, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING AGAINST US.</strong> You agree to bring claims only in your individual capacity and not as a plaintiff or class member in any purported class, collective, representative, multiple plaintiff, or similar proceeding.</p>

                <p><strong>NO CONSOLIDATION</strong>: You agree that arbitration proceedings cannot be consolidated with other arbitrations or combined with claims of other users, and the arbitrator has no authority to conduct any form of representative or class proceeding.</p>

                <p><strong>SEVERABILITY OF WAIVER</strong>: If this class action waiver is found unenforceable, then the entirety of this arbitration clause shall be null and void, but the remainder of these Terms shall remain enforceable.</p>

                <p><strong>PROHIBITION ON JOINING</strong>: You may not join or participate in claims brought by others against us, whether as a named party, class member, or otherwise, except in a properly filed individual arbitration proceeding.</p>

                <h4>14.4 Jurisdiction</h4>
                <p>For non-arbitrable matters, exclusive jurisdiction lies with state and federal courts in [COUNTY], California.</p>

                <h3>15. COMPLIANCE AND REGULATORY MATTERS</h3>

                <h4>15.1 AML/KYC Compliance</h4>
                <p>We may implement anti-money laundering (AML) and know-your-customer (KYC) procedures as required by applicable law.</p>

                <h4>15.2 Tax Obligations and Financial Risks</h4>
                <p>You are solely responsible for:</p>
                <ul>
                  <li>Determining and paying any taxes applicable to your NFT transactions and game activities</li>
                  <li>Understanding that participation involves high risk of total loss</li>
                  <li>Ensuring you can afford to lose your entire investment in Ducks and Zappers</li>
                  <li>Recognizing that this game is designed as entertainment where loss is the expected outcome for most participants</li>
                  <li>Consulting with financial advisors before participating if you have concerns about your financial situation</li>
                </ul>

                <h4>15.3 Regulatory Compliance</h4>
                <p>You must comply with all applicable laws regarding digital assets in your jurisdiction.</p>

                <h3>16. MISCELLANEOUS</h3>

                <h4>16.1 Entire Agreement</h4>
                <p>These Terms constitute the entire agreement between you and us regarding the Service.</p>

                <h4>16.2 Severability</h4>
                <p>If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full force and effect.</p>

                <h4>16.3 Assignment</h4>
                <p>We may assign these Terms without your consent. You may not assign your rights or obligations without our written consent.</p>

                <h4>16.4 Force Majeure</h4>
                <p>We are not liable for any failure to perform due to circumstances beyond our reasonable control, including blockchain network issues.</p>

                <h4>16.5 Survival</h4>
                <p>Sections relating to intellectual property, disclaimers, limitation of liability, indemnification, and dispute resolution survive termination of these Terms.</p>

                <h3>17. CONTACT INFORMATION</h3>
                <p>For questions about these Terms or the Service, contact us at:</p>

                <p><strong>[COMPANY NAME]</strong><br/>
                <strong>[ADDRESS]</strong><br/>
                <strong>[CITY], California [ZIP CODE]</strong><br/>
                <strong>Email: [EMAIL ADDRESS]</strong><br/>
                <strong>Phone: [PHONE NUMBER]</strong></p>

                <h3>ACKNOWLEDGMENT</h3>
                <p><strong>By using the Punk HUNT NFT Game Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You further acknowledge that you understand this is a high-risk elimination game where loss of your NFTs is the expected outcome, and you accept full financial responsibility for your participation.</strong></p>

              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="nes-btn is-success w-full" 
                onClick={handleCloseModal}
              >
                Accept
              </button>
              <button 
                type="button" 
                className="nes-btn w-full" 
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div 
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </>
  );
}

export default Terms;