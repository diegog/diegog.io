import type { IconSlug } from '@/images/homelab';

/*
 * Structured data for the /homelab page. The prose lives in homelab.mdx; this
 * file holds the lists that render as components inside it.
 *
 * `icon` is a slug from https://dashboardicons.com — after adding or changing
 * one, run `pnpm icons` to vendor the SVG into src/images/homelab/. The
 * `IconSlug` type is generated from what's on disk, so a slug that hasn't been
 * fetched yet fails typecheck rather than 404ing in the browser.
 *
 * Both lists are from the homelab repo's README and manifests.
 */

export type Machine = {
	name: string;
	/** what it does in the lab, e.g. "hypervisor", "NAS", "router" */
	role: string;
	/** how many identical units; omitted means one */
	count?: number;
	/** optional link, e.g. the repo that provisions it */
	url?: string;
	/** free-form spec lines, rendered as a list */
	specs: readonly string[];
};

export const machines: readonly Machine[] = [
	{
		name: 'Minisforum MS-01',
		role: 'Proxmox VE hosts — coltrane, davis, monk',
		count: 3,
		specs: [
			'Intel Core i9-13900H',
			'64 GB RAM',
			'Local ZFS pool for VM disks',
			'10 GbE SFP+ / 2.5 GbE'
		]
	},
	{
		name: 'Custom NAS',
		role: 'TrueNAS SCALE — built from old PC parts',
		specs: ['Intel Core i7-4770K', '32 GB RAM', '2 × 4 TB SSD', '500 GB SSD boot drive']
	},
	{
		name: 'Apple Mac mini',
		role: 'Self-hosted GitHub Actions runner (in progress)',
		url: 'https://github.com/diegog/mac-mini-ci',
		specs: [
			'Apple M4',
			'32 GB RAM',
			'macOS Tahoe, headless',
			'Every job in a throwaway macOS VM (Tart), host configured with pyinfra'
		]
	},
	{
		name: 'Ubiquiti UDM Pro',
		role: 'Router / firewall',
		specs: ['VLANs with inter-VLAN firewall rules', 'L2-only VLANs for the isolated egress vnets']
	},
	{
		name: 'Motorola MB8611',
		role: 'Cable modem',
		specs: ['DOCSIS 3.1', 'In service since 2021']
	}
];

export const serviceCategories = [
	'Platform',
	'Networking & identity',
	'Storage & data',
	'Observability',
	'Media',
	'Apps & automation'
] as const;

export type ServiceCategory = (typeof serviceCategories)[number];

export type Service = {
	name: string;
	/** dashboardicons.com slug — see the note at the top of this file */
	icon: IconSlug;
	/** the project's homepage */
	url: string;
	/** optional one line: what it does *for you* here */
	description?: string;
	category: ServiceCategory;
};

export const services: readonly Service[] = [
	// Platform
	{
		name: 'Proxmox VE',
		icon: 'proxmox',
		url: 'https://www.proxmox.com/en/proxmox-virtual-environment',
		category: 'Platform'
	},
	{ name: 'Debian', icon: 'debian-linux', url: 'https://www.debian.org', category: 'Platform' },
	{ name: 'macOS', icon: 'apple', url: 'https://www.apple.com/macos/', category: 'Platform' },
	{ name: 'Kubernetes', icon: 'kubernetes', url: 'https://kubernetes.io', category: 'Platform' },
	{ name: 'Cilium', icon: 'cilium', url: 'https://cilium.io', category: 'Platform' },
	{ name: 'Terraform', icon: 'terraform', url: 'https://www.terraform.io', category: 'Platform' },
	{ name: 'Ansible', icon: 'ansible', url: 'https://www.ansible.com', category: 'Platform' },
	{
		name: 'GitHub Actions',
		icon: 'github',
		url: 'https://github.com/features/actions',
		category: 'Platform'
	},

	// Networking & identity
	{ name: 'UniFi', icon: 'unifi', url: 'https://ui.com', category: 'Networking & identity' },
	{
		name: 'Traefik',
		icon: 'traefik',
		url: 'https://traefik.io',
		category: 'Networking & identity'
	},
	{
		name: 'Cloudflare',
		icon: 'cloudflare',
		url: 'https://www.cloudflare.com',
		category: 'Networking & identity'
	},
	{
		name: 'Authentik',
		icon: 'authentik',
		url: 'https://goauthentik.io',
		category: 'Networking & identity'
	},
	{
		name: 'WireGuard',
		icon: 'wireguard',
		url: 'https://www.wireguard.com',
		category: 'Networking & identity'
	},
	{
		name: 'Proton VPN',
		icon: 'proton-vpn',
		url: 'https://protonvpn.com',
		category: 'Networking & identity'
	},
	{ name: 'Whonix', icon: 'tor', url: 'https://www.whonix.org', category: 'Networking & identity' },

	// Storage & data
	{
		name: 'TrueNAS SCALE',
		icon: 'truenas-scale',
		url: 'https://www.truenas.com',
		category: 'Storage & data'
	},
	{
		name: 'CloudNativePG',
		icon: 'postgresql',
		url: 'https://cloudnative-pg.io',
		category: 'Storage & data'
	},
	{ name: 'MySQL', icon: 'mysql', url: 'https://www.mysql.com', category: 'Storage & data' },

	// Observability
	{ name: 'Grafana', icon: 'grafana', url: 'https://grafana.com', category: 'Observability' },
	{
		name: 'Prometheus',
		icon: 'prometheus',
		url: 'https://prometheus.io',
		category: 'Observability'
	},
	{ name: 'Loki', icon: 'loki', url: 'https://grafana.com/oss/loki/', category: 'Observability' },

	// Media
	{ name: 'Emby', icon: 'emby', url: 'https://emby.media', category: 'Media' },
	{ name: 'Radarr', icon: 'radarr', url: 'https://radarr.video', category: 'Media' },
	{ name: 'Sonarr', icon: 'sonarr', url: 'https://sonarr.tv', category: 'Media' },
	{ name: 'Ombi', icon: 'ombi', url: 'https://ombi.io', category: 'Media' },
	{ name: 'Navidrome', icon: 'navidrome', url: 'https://www.navidrome.org', category: 'Media' },
	{ name: 'Calibre', icon: 'calibre', url: 'https://calibre-ebook.com', category: 'Media' },
	{ name: 'Codex', icon: 'codex', url: 'https://github.com/ajslater/codex', category: 'Media' },

	// Apps & automation
	{
		name: 'Homepage',
		icon: 'homepage',
		url: 'https://gethomepage.dev',
		category: 'Apps & automation'
	},
	{
		name: 'Standard Notes',
		icon: 'standard-notes',
		url: 'https://standardnotes.com',
		category: 'Apps & automation'
	},
	{
		name: 'Synapse (Matrix)',
		icon: 'synapse',
		url: 'https://github.com/element-hq/synapse',
		category: 'Apps & automation'
	},
	{
		name: 'Home Assistant',
		icon: 'home-assistant',
		url: 'https://www.home-assistant.io',
		category: 'Apps & automation'
	},
	{ name: 'n8n', icon: 'n8n', url: 'https://n8n.io', category: 'Apps & automation' },
	{ name: 'TRMNL', icon: 'trmnl', url: 'https://usetrmnl.com', category: 'Apps & automation' }
];
