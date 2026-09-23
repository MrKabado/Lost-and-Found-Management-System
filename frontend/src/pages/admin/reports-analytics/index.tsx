import { useEffect, useMemo, useState } from "react"
import { Activity, AlertCircle, BarChart3, CheckCircle2, Package, RefreshCw, TrendingUp, Users } from "lucide-react"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { getAdminClaims, getAdminFoundItems, getAdminLostItems, getAdminStatistics, getApiError, type AdminStatistics, type Claim, type OwnedItem } from "@/lib/client"

const chartColors = ["#173F8A", "#D9B85A", "#2E8B70", "#B6503A", "#6D5BB3", "#4B7A9B"]
const emptyStatistics: AdminStatistics = {
	total_users: 0,
	total_lost_items: 0,
	total_found_items: 0,
	pending_claims: 0,
	returned_items: 0,
}

function getMonthKey(date: string) {
	const parsedDate = new Date(date)
	if (Number.isNaN(parsedDate.getTime())) return ""
	return `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`
}

function monthlyReports(items: OwnedItem[]) {
	const currentDate = new Date()
	const firstMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1)

	return Array.from({ length: 12 }, (_, index) => {
		const monthDate = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1)
		const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`
		return {
			month: new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(monthDate),
			reports: items.reduce((total, item) => total + (getMonthKey(item.created_at) === monthKey ? 1 : 0), 0),
		}
	})
}

function categoryReports(items: OwnedItem[]) {
	const categories = new Map<string, number>()
	items.forEach((item) => {
		const name = item.category?.name ?? "Uncategorized"
		categories.set(name, (categories.get(name) ?? 0) + 1)
	})
	return [...categories.entries()]
		.map(([name, reports]) => ({ name, reports }))
		.sort((a, b) => b.reports - a.reports)
		.slice(0, 6)
}

function claimStatusData(claims: Claim[]) {
	const statuses = new Map<string, number>()
	claims.forEach((claim) => {
		const status = claim.status.toLowerCase().replace(/_/g, " ")
		statuses.set(status, (statuses.get(status) ?? 0) + 1)
	})
	return [...statuses.entries()].map(([name, value]) => ({
		name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
		value,
	}))
}

export default function ReportsAnalytics() {
	const [statistics, setStatistics] = useState(emptyStatistics)
	const [lostItems, setLostItems] = useState<OwnedItem[]>([])
	const [foundItems, setFoundItems] = useState<OwnedItem[]>([])
	const [claims, setClaims] = useState<Claim[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const loadReports = async () => {
		try {
			setError("")
			setLoading(true)
			const [nextStatistics, nextLost, nextFound, nextClaims] = await Promise.all([
				getAdminStatistics(),
				getAdminLostItems(),
				getAdminFoundItems(),
				getAdminClaims(),
			])
			setStatistics(nextStatistics)
			setLostItems(nextLost)
			setFoundItems(nextFound)
			setClaims(nextClaims)
		} catch (requestError) {
			setError(getApiError(requestError, "Unable to load reports and analytics."))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void Promise.resolve().then(loadReports)
	}, [])

	const lostByMonth = useMemo(() => monthlyReports(lostItems), [lostItems])
	const foundByMonth = useMemo(() => monthlyReports(foundItems), [foundItems])
	const categories = useMemo(() => categoryReports([...lostItems, ...foundItems]), [lostItems, foundItems])
	const claimStatuses = useMemo(() => claimStatusData(claims), [claims])
	const stats = [
		{ label: "Total lost items", value: statistics.total_lost_items, note: "Reports submitted", icon: Package, color: "#173F8A" },
		{ label: "Total found items", value: statistics.total_found_items, note: "Items reported", icon: CheckCircle2, color: "#2E8B70" },
		{ label: "Total claims", value: claims.length, note: `${statistics.pending_claims} awaiting review`, icon: Activity, color: "#B6503A" },
		{ label: "Registered users", value: statistics.total_users, note: "Active accounts", icon: Users, color: "#6D5BB3" },
	]

	return (
		<div className="min-w-0 pb-16">
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B6503A]">
						<BarChart3 size={14} /> Overview
					</div>
					<h1 className="font-sans text-[30px] font-semibold tracking-tight text-[#092354]">Reports & analytics</h1>
					<p className="mt-1.5 text-sm text-[#68738A]">A clear view of campus item activity and claim outcomes.</p>
				</div>
				<button
					type="button"
					onClick={() => void loadReports()}
					disabled={loading}
					title="Refresh analytics"
					className="inline-flex items-center gap-2 rounded-lg border border-[#D8DCEF] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#173F8A] shadow-sm transition hover:border-[#173F8A] hover:bg-[#F7F9FF] disabled:cursor-not-allowed disabled:opacity-60"
				>
					<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
					{loading ? "Refreshing..." : "Refresh data"}
				</button>
			</div>

			{error && (
				<div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					<AlertCircle size={16} /> {error}
				</div>
			)}

			<div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ label, value, note, icon: Icon, color }) => (
					<div key={label} className="relative overflow-hidden rounded-xl border border-[#DDE1EC] bg-white p-5 shadow-[0_5px_20px_rgba(9,35,84,0.04)]">
						<div className="absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-10" style={{ backgroundColor: color }} />
						<div className="flex items-start justify-between">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15`, color }}><Icon size={18} /></div>
							<TrendingUp size={15} className="text-[#2E8B70]" />
						</div>
						<p className="mt-5 text-xs font-medium text-[#68738A]">{label}</p>
						<p className="mt-1 text-[30px] font-semibold tracking-tight text-[#092354]">{loading ? "-" : value.toLocaleString()}</p>
						<p className="mt-1 text-[11px] text-[#8A93A5]">{note}</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
				<ChartCard title="Lost reports per month" subtitle="Monthly volume over the last 12 months">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={lostByMonth} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
						<CartesianGrid stroke="#E9ECF3" vertical={false} />
						<XAxis dataKey="month" tick={{ fill: "#8A93A5", fontSize: 11 }} axisLine={false} tickLine={false} />
						<YAxis allowDecimals={false} tick={{ fill: "#8A93A5", fontSize: 11 }} axisLine={false} tickLine={false} />
						<Tooltip contentStyle={{ border: "1px solid #DDE1EC", borderRadius: 8, fontSize: 12 }} />
						<Line type="monotone" dataKey="reports" name="Reports" stroke="#173F8A" strokeWidth={3} dot={{ r: 3, fill: "#173F8A", strokeWidth: 0 }} activeDot={{ r: 5 }} />
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Found reports per month" subtitle="Monthly volume over the last 12 months">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={foundByMonth} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
						<CartesianGrid stroke="#E9ECF3" vertical={false} />
						<XAxis dataKey="month" tick={{ fill: "#8A93A5", fontSize: 11 }} axisLine={false} tickLine={false} />
						<YAxis allowDecimals={false} tick={{ fill: "#8A93A5", fontSize: 11 }} axisLine={false} tickLine={false} />
						<Tooltip contentStyle={{ border: "1px solid #DDE1EC", borderRadius: 8, fontSize: 12 }} />
						<Line type="monotone" dataKey="reports" name="Reports" stroke="#2E8B70" strokeWidth={3} dot={{ r: 3, fill: "#2E8B70", strokeWidth: 0 }} activeDot={{ r: 5 }} />
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Claims status distribution" subtitle="Current status across all submitted claims">
					<div className="flex h-[250px] items-center justify-center">
						{claimStatuses.length === 0 ? <EmptyChart /> : <ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={claimStatuses} dataKey="value" nameKey="name" cx="50%" cy="46%" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
									{claimStatuses.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
								</Pie>
								<Tooltip contentStyle={{ border: "1px solid #DDE1EC", borderRadius: 8, fontSize: 12 }} />
								<Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#68738A" }} />
							</PieChart>
						</ResponsiveContainer>}
					</div>
				</ChartCard>

				<ChartCard title="Top item categories" subtitle="Lost and found reports by category">
					<div className="h-[250px]">
						{categories.length === 0 ? <EmptyChart /> : <ResponsiveContainer width="100%" height="100%">
							<BarChart data={categories} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
								<CartesianGrid stroke="#E9ECF3" horizontal={false} />
								<XAxis type="number" allowDecimals={false} tick={{ fill: "#8A93A5", fontSize: 11 }} axisLine={false} tickLine={false} />
								<YAxis type="category" dataKey="name" width={84} tick={{ fill: "#68738A", fontSize: 11 }} axisLine={false} tickLine={false} />
								<Tooltip cursor={{ fill: "#F7F9FF" }} contentStyle={{ border: "1px solid #DDE1EC", borderRadius: 8, fontSize: 12 }} />
								<Bar dataKey="reports" name="Reports" fill="#D9B85A" radius={[0, 4, 4, 0]} barSize={20} />
							</BarChart>
						</ResponsiveContainer>}
					</div>
				</ChartCard>
			</div>
		</div>
	)
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
	return (
		<section className="rounded-xl border border-[#DDE1EC] bg-white p-5 shadow-[0_5px_20px_rgba(9,35,84,0.04)]">
			<div className="mb-4">
				<h2 className="text-[15px] font-semibold text-[#092354]">{title}</h2>
				<p className="mt-1 text-[11px] text-[#8A93A5]">{subtitle}</p>
			</div>
			<div className="h-[250px] w-full">{children}</div>
		</section>
	)
}

function EmptyChart() {
	return <div className="flex h-full items-center justify-center text-sm text-[#8A93A5]">No report data available yet.</div>
}
