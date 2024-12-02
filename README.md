![Logo](https://github.com/jgomes79/NOSTROMO/blob/main/Intro.png)
# NOSTROMO - Launchpad Proposal for the QUBIC Blockchain

## 1. Project Overview

The **NOSTROMO** launchpad is set to become the first dedicated platform on the QUBIC blockchain, enabling new projects to initiate token sales (IDOs). As a versatile, sci-fi-inspired platform, NOSTROMO will bring a web3-based launchpad experience to QUBIC, establishing an ecosystem where projects can connect with investors and community members.

## 2. Inspiration and Concept

Named after the iconic spaceship in _Alien_, the NOSTROMO platform embodies the spirit of launching into new territories, resonating with the journey of new blockchain projects. Roles, designs, and functionalities will reflect a sci-fi aesthetic with themes of metamorphosis and space missions, capturing the essence of a launchpad as a "ship" setting off into the unknown, sometimes with surprising "passengers" along the way.

----------

## 3. Launchpad Functionality

### 3.1 Landing Page

The landing page will serve as the hub of NOSTROMO, featuring:

-   **Main Introduction**: An overview of the platform’s mission and user engagement options.
-   **Upcoming & Ongoing Pools**: Highlighted sections displaying active and upcoming token sales.
-   **Launchpad Overview**: Explanation of how the launchpad operates, benefits for project owners, and opportunities for investors.
-   **Footer**: Links to social media, contact info, terms of use, and privacy policy.

### 3.2 Project Life Cycle

Enabling users to create their projects and manage their token sales:

The projects will have the following states:
-	**Draft Mode**: Projects are first created in a “Draft” state.
-	**Approval Process**: Projects remain private until reviewed and approved by DAO members after discussion with project owners.
-	**Approved or rejected**: Depending on the result of the user votes.
-	**Funded**: If the project raise all money asked.
-	**Failed**: If the project doesn't raise the minimum amount of money asked.
During the development we will ask the community if everybody will be able to create a new project or if users must have a minimum amount of QUBIC tokens to create a project.

To create a new project the user will have to fill a record with the following fields:
-	Project name
-	Description
-	Banner & logo
-	Social networks
-	Amount to raise and token to invest (at the beginning will be only QUBIC and when bridges start to be available, we could add USDT or similar)
-	Start and end dates
-	Project tokenomics and token information
-	Cliff and vesting options
-	Minimum amount of investment received to continue ahead with the project.

After the project is created by the owner, project status will become “Approval Process” and the DAO will vote if the project is approved or rejected.
If the project is rejected, it will disappear from the launchd and owner will be notified.
If the project is approved, the project will be available in the section of “Upcoming pools” and people could invest when reach the start date.
If the project reaches the max investment before the end date, the investment process will close and the tokens will be allocated in the SmartContracts to be ready to claim according with the cliff & vesting configuration.
If the project doesn't reach the maximum amount before the end date, if the minimum amount is reached, the tokens will be allocated in the SmartContracts in the same way described in the previous point.
If the project doesn't reach the minimum amount before the end date, the project will be closed and the investment will be returned to the investors.


### 3.3 Capital Distribution for New Projects

Each project launched will allocate 5% of raised capital as follows:

-   **2.5% for Launchpad Creators**: For maintenance.
-   **2.5% for the QUBIC Ecosystem Fund**: To reinforce community support and platform growth. As the ecosystem matures, the model may incorporate buyback and burning mechanisms for public pools, leveraging Automated Market Makers (AMMs) and Decentralized Exchanges (DEXs).

### 3.4 Tiered Participation System

A tiered system incentivizes users to stake $QUBIC for enhanced benefits:

-   **Tiered Roles**: Access to roles offering higher pool weights, reduced fees, and exclusive access based on staked amounts.
-   **Participation Fees**:
    -   **Lower Tiers**: 3% fee (1.5% to Launchpad Creators, 1.5% to the QUBIC Ecosystem Fund).
    -   **Highest Tier**: 1% fee (0.5% to each).

![Logo](https://github.com/jgomes79/NOSTROMO/blob/main/Architecture.png)

### 3.5 Claim Section

A designated section allows users to claim purchased tokens and staking rewards. The claimable amount will depend on user tier level, rewarding users with higher allocations and reduced claim fees in proportion to their participation.

### 3.6 User Section

A user must use Metamask snaps to login in the launchpad. Once is logged could access to any functionality that requires a transaction (create a project, invest, claim).
In the user section, users could have a centralized dashboard to see their investments and to manage (claim, stake, …) all the actions in an easy way.

### 3.7 Shareholders Smart Contracts Fees

In all SmartContracts developed there will be a fee set up by a community DAO vote

----------

## 4. Technical Development Scope

### 4.1 Scope of Services and Platform Features

-   **Platform Design**:
    -   Web3 Interface for streamlined user experience.
    -   SmartContract specifications, to be developed independently.
    -   Frontend & Backend Development for a responsive platform.
-   **Core Functionalities**:
    -   **Landing Page**: Quick access to active and upcoming projects.
    -   **IDO Launchpad**: Infrastructure for token sales.
    -   **Navigation Sections**:
        -   **Home**: Platform overview.
        -   **Upcoming/Completed Pools**: Project statuses.
        -   **Project Page**: Detailed project views and investment functionality.
    -   **Stake Functionality**:
        -   **Pool Creation** for project owners with reward and duration settings.
        -   Full staking and reward claiming functionalities.
    -   **User Dashboard**:
        -   Overview of interactions, holdings, and history.
        -   **My Projects**: User-created projects.
        -   **My Claims**: Overview of claimable tokens and rewards.
    -   **Admin Dashboard**:
        -   Project Review & Approval, potentially integrating DAO voting.
-   **SmartContract Integration**:
    -   Wallet Integration via MetaMask snaps.
    -   Backend RPC Access if necessary.
-   **Additional Considerations**:
    -   Any development outside the initial scope will be evaluated separately.
    -   Hosting setup is not included.
    -   External audit is not included.

----------

## 5. Future improvements

- Integration with a mobile wallet: As soon mobile wallets for QUBIC could be used from a webapp, we could integrate them to allow them to invest and claim from a mobile phone or tablet.
- Integrate the possibility of creating the project token directly from the launchpad.
- Integrate the possibility to list the project token in a DEX directly from the launchpad.

----------

## 6. Tech Stack
![Logo](https://github.com/jgomes79/NOSTROMO/blob/main/TechArchitecture.png)

-  **Frontend**:
   - Vite
   - Metamask snaps
-  **Backend**:
   - NodeJs + Typescript
-  **Database**:
   - MySQL
-  **Access to QUBIC blockchain**:
   - Metamask snaps
   - RPC node
-  **Cloud**:
   - AWS or Azure

----------

## 7. Marketing and Communication strategy
-   **Building a Content Flow**:
    -   Editorial Calendar: Include content types (educational, promotional, community), posting frequency, and special events.
    -   Specific Launch Campaigns: Strategic campaign ideas for new launches to promote community projects.
    -   Custom Content: Create specific content for each platform to maximise engagement.
        -   Twitter
        -   Discord
        -   Medium
        -   Telegram

-   **Building Word of Mouth**:
    -   Brand Ambassador Program: Identify KOLs whose content resonates with the brand's industry and values
    -   Management of AMAs and partnerships
    -   Managing KOL content about the project
    -   In-house content management

-   **Building a speaker network**:
    -   Management of Discord AMAs
    -   Management of regular Twitter Spaces: Plan regular events, such as developer spaces and Q&A sessions, to increase interaction and engagement. Some of our collaborators:
        -   UnfungibleXYZ
        -   Ankhlabs

-   **Building sense of belonging**:
    -   We want to build a gamified ecosystem based on our users. We are specialists in creating gamified campaigns for communities.
    -   Using this as a base point, the goal is to create a social system of entertainment, interaction and rewards that will attract new users to the QUBIC gang.
    -   How we will start - Building a Gamified Community Channels:
        -   Set-up Discord server and roles
        -   Set-up Telegram group
        -   Community Manager full-time: Establish a system for community support and moderation, ensuring a positive and supportive environment.
        -   Creating a SocialFi, games and community participation system based on the study of our users.
        -   Identify and empower the most active and passionate members of the community.
        -   Rewards program

-   **User acquisition strategy**:
    -   Coinzilla Ads Management
    -   Persona3 Ads Management
    -   Google Ads Management
    -   Meta Ads Management

----------

## 8. Milestones and Timeline

-   **Project Start**: November 11
-   **Milestone 1 (Nov 29)**:
    -   SmartContract definition.
    -   Mechanism design.
    -   Landing page beta.
    -   Design basis.
-   **Milestone 2 (Jan 15)**:
    -   Final design (Figma).
    -   Completed landing page.
    -   IDO launchpad.
    -   User section.
-   **Milestone 3 (Feb 14)**:
    -   Staking page.
    -   Claim pages.
-   **Milestone 4 (Mar 14)**:
    -   SmartContract integration.
    -   Platform testing.
-   **Milestone 5 (Apr 10)**:
    -   Full platform launch.

----------

## 9. Budget and Payment Structure

-   **Total Project Cost**: $69,000 USD
    -   **Technical Development**: $58,000 USD
    -   **Design**: $4,000 USD
    -   **BizDev + Mechanics**: $7,000 USD
-   **Payment Plan**:
    -   **Initial Payment (20%)**: $13,800 USD
    -   **Milestone 1 (12.5%)**: $8,625 USD
    -   **Milestone 2 (12.5%)**: $8,625 USD
    -   **Milestone 3 (12.5%)**: $8,625 USD
    -   **Milestone 4 (12.5%)**: $8,625 USD
    -   **Milestone 5 (30%)**: $20,700 USD
-   **Additional Costs**:
    -   Hosting setup proposal: $7,000 USD/year (if finally costs are cheaper, we will return the remaining funds to the DAO)
    -   Marketing: Costs are estimated **and will be supported using the fees generated in the LaunchPad**
        -   Community management: $15,000 USD/year
        -   AMAs and KOL Manager. $20,000 USD/year
        -   Ads Management: $15,000 USD/year
    -   Audits are not included.

----------

## 10. Team

**Jorge**: Backend & SmartContract Integration

- Expert in SmartContract design and backend integrations for decentralized platforms.

**German**: Frontend Development

- Specializes in user-centered designs and web3 interface optimization.

**Javier**: BizDev & Token Economy

- Extensive background in tokenomics, strategy, and smart contract mechanics.

**Team Experience Highlights:**

- Rungie: Developed SmartContracts for FrameIt (Overgie)

- Team Queso: STO mechanism design, NFTs.

- LitlabGames (Co-founder): Token economy, launch strategies.

- ElixirGames (C-Level): Tokenomics for $ELIX and RoboKiden (first game) SmartContracts development.

- Zignaly: Token creation, staking, EVM-Solana bridge.

- CryptoPlaza: Hackathon winner with a custom Balancer DEX.

- Realfund: STO real estate platform.

- GivitNFT: NFT-based community creation platform. (https://givitnft.com)

- BRND.land: Farcaster web app to increase engagement with Brands (https://brnd.land)

----------

## 11. Links to public projects developed by the team
- https://www.overgie.com
- https://givitnft.com
- https://brnd.land
- https://robokiden.com/

----------

## 12. Conclusion

This proposal for the NOSTROMO launchpad integrates innovative capital distribution, tiered participation, and custom SmartContract requirements to deliver a unique, sci-fi-themed platform that empowers projects and investors. Our team’s expertise spans technical development and token economics, positioning NOSTROMO as the key launchpad within the QUBIC ecosystem.
