# OpenClaw Secure Setup

## Table of contents

- [OpenClaw Secure Setup](#openclaw-secure-setup)
  - [Table of contents](#table-of-contents)
  - [Setup VPS](#setup-vps)
    - [Update and upgrade](#update-and-upgrade)
    - [Install Tailscale](#install-tailscale)
    - [Edit `/etc/ssh/sshd_config`](#edit-etcsshsshd_config)
    - [Create a new user](#create-a-new-user)
    - [Instal useful packages](#instal-useful-packages)
  - [Install OpenClaw](#install-openclaw)
    - [Installation steps](#installation-steps)
      - [I understand this is powerful and inherently risky. Continuer?](#i-understand-this-is-powerful-and-inherently-risky-continuer)
      - [Onboarding mode](#onboarding-mode)
      - [What do you want to set up?](#what-do-you-want-to-set-up)
      - [Workspace directory](#workspace-directory)
      - [Model/auth provider](#modelauth-provider)
      - [Default model](#default-model)
      - [Gateway port](#gateway-port)
      - [Gateway bind](#gateway-bind)
      - [Gateway auth](#gateway-auth)
      - [Tailscale exposure](#tailscale-exposure)
      - [Reset Tailscale serve/funnel on exit?](#reset-tailscale-servefunnel-on-exit)
      - [How do you want to provide the gateway token?](#how-do-you-want-to-provide-the-gateway-token)
      - [Where is this gateway token stored?](#where-is-this-gateway-token-stored)
      - [Environment variable name](#environment-variable-name)
      - [Configure chat channels now?](#configure-chat-channels-now)
      - [Search modelauth-provider](#search-modelauth-provider)
      - [Configure skills now? (recommended)](#configure-skills-now-recommended)
      - [Configure plugins (select to setup now, or skip)](#configure-plugins-select-to-setup-now-or-skip)
      - [Enable hooks?](#enable-hooks)
      - [Install Gateway service (recommended)](#install-gateway-service-recommended)
      - [Gateway service runtime](#gateway-service-runtime)
      - [How do you want to hatch your bot?](#how-do-you-want-to-hatch-your-bot)
      - [Enable bash shell completion for openclaw?](#enable-bash-shell-completion-for-openclaw)
  - [Setup OpenClaw agent](#setup-openclaw-agent)
    - [USER.md - Who are you?](#usermd---who-are-you)
    - [IDENTITY.md - Who is your agent?](#identitymd---who-is-your-agent)
    - [SOUL.md - How should your agent behave?](#soulmd---how-should-your-agent-behave)
      - [Core thruths](#core-thruths)
      - [Boundaries](#boundaries)
      - [Vibe](#vibe)
      - [Values](#values)
    - [MEMORY.md - What should the agent always know?](#memorymd---what-should-the-agent-always-know)
      - [Preferences](#preferences)
      - [Projects](#projects)
      - [People \& Clients](#people--clients)
      - [Decisions](#decisions)
      - [Lessons Learned](#lessons-learned)
    - [Bonus - General setup questions](#bonus---general-setup-questions)
  - [Resources](#resources)
    - [Useful links](#useful-links)
    - [Useful Discord resources](#useful-discord-resources)
      - [Permissions](#permissions)
      - [Commands](#commands)

## Setup VPS

### Update and upgrade

```bash
apt update; apt full-upgrade -y; reboot
```

### Install Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up --ssh
```

### Edit `/etc/ssh/sshd_config`

> This is needed to allow the VPS to be reachable via Tailscale.

```bash
sudo nano /etc/ssh/sshd_config
```

Add the following lines:

```bash
ListenAddress YOUR_TAILSCALE_VPS_IP
MaxAuthTries 3
PasswordAuthentication no
PermitEmptyPasswords no
PermitRootLogin no
```

### Create a new user

> This user will be used to connect to the VPS via SSH.

```bash
# Create a new user and add it to sudo group
adduser user
usermod -aG sudo user

# Log out and log back in as user
su - user

# Setup OpenClaw Gateway Token
echo "" >> .bashrc
echo "# OpenClaw Gateway Token" >> .bashrc
echo "export OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)" >> .bashrc

# Setup path
echo "" >> ~/.bashrc
echo "# Path definitions."
echo 'export PATH="/home/user/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Configure Tailscale for the new user
sudo tailscale set --operator=$USER
logout

# You are now logged in as root
systemctl restart ssh
```

### Instal useful packages

```bash
apt install -y neovim trash-cli ffmpeg tmux ripgrep
npm install -g clawhub @steipete/summarize @google/gemini-cli
```

## Install OpenClaw

To install OpenClaw, run the following command:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Installation steps

#### I understand this is powerful and inherently risky. Continuer?

- [x] Yes
- [ ] No

#### Onboarding mode

- [ ] QuickStart
- [x] Manual

#### What do you want to set up?

- [x] Local gateway
- [ ] Remote gateway

#### Workspace directory

`/home/user/.openclaw/workspace/main`

#### Model/auth provider

What do you want.

#### Default model

What do you want.

#### Gateway port

`18789`

#### Gateway bind

- [ ] Loopback
- [ ] LAN
- [x] Tailnet
- [ ] Auto
- [ ] Custom IP

#### Gateway auth

- [x] Token
- [ ] Password

#### Tailscale exposure

- [ ] Off
- [x] Serve
- [ ] Funnel

#### Reset Tailscale serve/funnel on exit?

- [x] Yes
- [ ] No

#### How do you want to provide the gateway token?

- [ ] Generate/store plaintext token
- [x] Use SecretRef

#### Where is this gateway token stored?

- [x] Environment variable
- [ ] Configured secret provider

#### Environment variable name

`OPENCLAW_GATEWAY_TOKEN`

#### Configure chat channels now?

- [ ] Yes
- [x] No

#### Search modelauth-provider

What do you want.

#### Configure skills now? (recommended)

- [ ] Yes
- [x] No

#### Configure plugins (select to setup now, or skip)

- [x] Skip for now
- ...

#### Enable hooks?

- [ ] Skip for now
- [x] boot-md
- [x] bootstrap-extra-files
- [x] command-logger
- [x] session-memory

#### Install Gateway service (recommended)

- [x] Yes
- [ ] No

#### Gateway service runtime

- [x] Node (recommended)

#### How do you want to hatch your bot?

- [ ] Hatch in Terminal (recommended)
- [x] Do this later

#### Enable bash shell completion for openclaw?

- [x] Yes
- [ ] No

## Setup OpenClaw agent

### USER.md - Who are you?

1. What's your name and what should the agent call you?
2. What's timezone you're in?
3. What are your pronouns?
4. What's your profession/role/title?
5. What does your business actually do? Describe it in one sentence.
6. What are your current projects right now?
7. What tools and tech stack do you use daily?
8. What are your work hours?
9. Do you prefer concise or detailed answers?
10. What formating do you like - bullet points, prose, code blocks, tables?
11. What tone do you prefer - casual, formal, friendly, professional, somewere in between?
12. What response length feels right for you?
13. What are your top priorities this quarter?
14. What frustrates you about AI resonses? Be specific.
15. What reccuring preferences should the agent always remember?
16. What platforms are you active on - email, Slack, X, etc.?
17. What are the specific words, phrases, or styles you want the agent to avoid?
18. What does a "good day of work" look like for you?

### IDENTITY.md - Who is your agent?

1. What do you want to name your agent?
2. What kind of entity is it - AI assistant, digital familiar, collaborator, ghost in the machine, etc.?
3. Describe its vibe in one line - Sharp and dry? Warm and patient? Chaotic but reliable?
4. Pick a signature emoji for it.
5. Do you have an avatar for it? (optional)

### SOUL.md - How should your agent behave?

#### Core thruths

1. What are 3-5 principles you want the agent to always follow?
2. Should it be genuinely helpful or play it safe? Where's the line?
3. Should it have opinions and preferences or stay neutral?
4. Should it try to figure things out itself before asking you, or check in frequently?
5. How careful should i be with your data and access?

#### Boundaries

1. What should it be allowed to do without asking — reading files, organizing notes, internal research?
2. What should it notify you about after doing - updating memory, joining services?
3. What must it always ask you before doing - sending emails, spending money, posting publicly?
4. Are there any topics or actions that are completely off limits?
5. How should it behave in group chats vs. private conversations?

#### Vibe

1. How should it talk to you - concise or thorough? Direct or diplomatic?
2. Should it use humor? What kind?
3. Are there words or phrases you want it to never use? (e.g., "delve", "tapestry", em dashes. exclamation marks)
4. Should it explain its reasoning, or just give you the answer?
5. Should it be proactive or wait for instructions?

#### Values

1. When there's a tradeoff, what wins — speed or accuracy?
2. Should it prioritize being cautious or being bold?
3. How should it handle uncertainty — flag it, make a best guess, or ask?
4. What does "trustworthy" look like to you in an assistant?
5. Should it push back on you if it thinks you're

### MEMORY.md - What should the agent always know?

#### Preferences

1. What tools, languages, or frameworks do you prefer?
2. What response styles work best for your
3. What things annoy you that the agent should stop doing?

#### Projects

1. What are your active projects right now?
2. What's the status of each one?
3. What are the key conventions or patterns for each project?
4. What deadlines or milestones are coming

#### People & Clients

1. Who are your key clients or collaborators?
2. What are they working on?
3. What's the current status of each relationship?
4. Is there any context the agent needs about how to handle specific people?

#### Decisions

1. What important decisions have you already made that the agent shouldn't revisit?
2. Why did you make those decisions? (rationale matters)
3. What tool choices or architecture decisions are locked in?

#### Lessons Learned

1. What workarounds have you discovered for recurring problems?
2. What API quirks, rate limits, or gotchas should the agent know about?
3. What broke in the past and how did you fix it?
4. What mistakes should the agent help you avoid repeating?

### Bonus - General setup questions

1. What's the single most important thing your agent should know about you?
2. If your agent could only remember one preference, what would it be?
3. What's the most annoying thing a generic Al does that you want your agent to never do?
4. What would make you trust your agent enough to let it act on its own?
5. Six months from now, what should your agent know that it doesn't know today?

## Resources

### Useful links

- [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) - OpenClaw GitHub repository
- [https://docs.openclaw.ai/](https://docs.openclaw.ai/) - OpenClaw documentation
- [https://github.com/Samin12/obsidian-openclaw-memory](https://github.com/Samin12/obsidian-openclaw-memory) - Obsidian plugin for OpenClaw memory
- [https://github.com/builderz-labs/mission-control](https://github.com/builderz-labs/mission-control) - Mission Control GitHub repository
- [https://www.agentmail.to/](https://www.agentmail.to/) - AgentMail website
- [https://gist.github.com/mberman84/cd6924c7058ba5251a773dac177ae756](https://gist.github.com/mberman84/cd6924c7058ba5251a773dac177ae756) - mberman84 OpenClaw SOUL.md file
- [https://github.com/mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) - mvanhorn Last 30 Days skill

### Useful Discord resources

#### Permissions

- View channels
- Send messages
- Create public threads
- Send messages in threads
- Read message history
- Embed links
- Attach files
- Add reactions

> Permission code: `309237763136`

#### Commands

- `/thread thead-name message-to-explain-the-thread` - Create a thread in a discord channel
