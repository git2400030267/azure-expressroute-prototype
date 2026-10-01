import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedNode, setSelectedNode] = useState(null);
  const [erAFailed, setErAFailed] = useState(false);
  const [vpnActive, setVpnActive] = useState(false);

  const simulateFailure = () => {
    setErAFailed(true);
    setVpnActive(true);
  };

  const restoreNetwork = () => {
    setErAFailed(false);
    setVpnActive(false);
  };

  const navigate = (page) => {
    setActivePage(page);
    setSelectedNode(null);
  };

  /* ---------------- SIDEBAR ---------------- */

  const sidebarItem = (icon, name) => (
    <button
      className={`nav-item ${activePage === name ? "active" : ""}`}
      onClick={() => navigate(name)}
    >
      <span>{icon}</span>
      {name}
    </button>
  );

  /* ---------------- DASHBOARD ---------------- */

  const DashboardPage = () => (
    <>
      <PageHeader
        title="Network Overview"
        subtitle="ExpressRoute hybrid connectivity monitoring"
      />

      {/* STATUS CARDS */}
      <section className="stats-grid">

        <StatCard
          title="Campus Network"
          value="Connected"
          status="● Healthy"
          extra="24/24 Nodes"
          icon="⌁"
          color="blue"
        />

        <StatCard
          title="ExpressRoute A"
          value={erAFailed ? "Failed" : "Active"}
          status={erAFailed ? "● Disconnected" : "● Primary Path"}
          extra="50 Mbps"
          icon="⇄"
          color="purple"
          danger={erAFailed}
        />

        <StatCard
          title="ExpressRoute B"
          value="Active"
          status="● Secondary"
          extra="50 Mbps"
          icon="⇄"
          color="green"
        />

        <StatCard
          title="VPN Backup"
          value={vpnActive ? "Active" : "Standby"}
          status={vpnActive ? "● Failover Path" : "● Ready"}
          extra="Backup"
          icon="🔐"
          color="orange"
          backup={vpnActive}
        />

      </section>

      {/* TOPOLOGY */}
      <section className="panel topology-panel">

        <PanelHeader
          title="Network Topology"
          subtitle="Click a component to view details"
          badge="● LIVE"
        />

        <div className="topology">

          <ClickableNode
            icon="🏫"
            title="University Campus"
            subtitle="Campus LAN"
            type="Campus"
            onClick={() => setSelectedNode("Campus")}
          />

          <div className="route-area">

            <ClickableRoute
              title="ExpressRoute A"
              status={erAFailed ? "FAILED" : "50 Mbps • Primary"}
              failed={erAFailed}
              onClick={() => setSelectedNode("ExpressRoute A")}
            />

            <ClickableRoute
              title="ExpressRoute B"
              status="50 Mbps • Secondary"
              secondary
              onClick={() => setSelectedNode("ExpressRoute B")}
            />

            {vpnActive && (
              <ClickableRoute
                title="VPN Backup"
                status="FAILOVER ACTIVE"
                vpn
                onClick={() => setSelectedNode("VPN Backup")}
              />
            )}

          </div>

          <ClickableNode
            icon="☁"
            title="Azure VNet"
            subtitle="Cloud + DR"
            azure
            onClick={() => setSelectedNode("Azure VNet")}
          />

        </div>

        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

      </section>

      {/* TWO COLUMN */}
      <section className="two-column">

        <div className="panel">

          <PanelHeader
            title="System Health"
            subtitle="Current infrastructure status"
            badge="99.9%"
            greenBadge
          />

          <HealthRow
            title="ExpressRoute Gateway"
            detail="ErGw1AZ"
          />

          <HealthRow
            title="BGP Session"
            detail="Route exchange"
          />

          <HealthRow
            title="Azure VNet"
            detail="Campus-VNet"
          />

          <HealthRow
            title="Gateway Subnet"
            detail="10.0.255.0/27"
          />

        </div>

        <div className="panel">

          <PanelHeader
            title="Network Metrics"
            subtitle="Current network performance"
          />

          <MetricRow label="Bandwidth" value="50 Mbps" />
          <MetricRow label="Latency" value="12 ms" />
          <MetricRow label="Packet Loss" value="0.1%" />
          <MetricRow label="Availability" value="99.99%" />

        </div>

      </section>

      {/* SIMULATION */}
      <section className="panel simulation-panel">

        <PanelHeader
          title="Network Simulation"
          subtitle="Demonstrate resilience and failover"
        />

        {!erAFailed ? (
          <button className="danger-button" onClick={simulateFailure}>
            ⚠ Simulate ExpressRoute A Failure
          </button>
        ) : (
          <button className="restore-button" onClick={restoreNetwork}>
            ✓ Restore Primary Connection
          </button>
        )}

        <div className="simulation-message">
          {erAFailed
            ? "ExpressRoute A has failed. ExpressRoute B and VPN Backup are handling the connection."
            : "All primary and secondary connectivity paths are available."
          }
        </div>

      </section>
    </>
  );


  /* ---------------- EXPRESSROUTE PAGE ---------------- */

  const ExpressRoutePage = () => (
    <>
      <PageHeader
        title="ExpressRoute"
        subtitle="Dedicated private connectivity management"
      />

      <section className="stats-grid">

        <StatCard
          title="Circuit A"
          value={erAFailed ? "Failed" : "Active"}
          status={erAFailed ? "● Offline" : "● Primary"}
          extra="50 Mbps"
          icon="⇄"
          color="purple"
          danger={erAFailed}
        />

        <StatCard
          title="Circuit B"
          value="Active"
          status="● Secondary"
          extra="50 Mbps"
          icon="⇄"
          color="green"
        />

        <StatCard
          title="BGP"
          value="Established"
          status="● Healthy"
          extra="Route Exchange"
          icon="↔"
          color="blue"
        />

        <StatCard
          title="Gateway"
          value="Healthy"
          status="● Connected"
          extra="ErGw1AZ"
          icon="▣"
          color="orange"
        />

      </section>

      <section className="two-column">

        <div className="panel">

          <PanelHeader
            title="ExpressRoute Circuit A"
            subtitle="Primary connectivity path"
          />

          <DetailRow label="Status" value={erAFailed ? "Failed" : "Active"} />
          <DetailRow label="Role" value="Primary" />
          <DetailRow label="Bandwidth" value="50 Mbps" />
          <DetailRow label="Peering" value="Private" />
          <DetailRow label="Provider" value="Connectivity Provider" />
          <DetailRow label="Peering Location" value="Mumbai" />

          <button
            className={erAFailed ? "restore-button full-button" : "danger-button full-button"}
            onClick={erAFailed ? restoreNetwork : simulateFailure}
          >
            {erAFailed
              ? "✓ Restore Circuit A"
              : "⚠ Simulate Circuit Failure"
            }
          </button>

        </div>

        <div className="panel">

          <PanelHeader
            title="ExpressRoute Circuit B"
            subtitle="Secondary connectivity path"
          />

          <DetailRow label="Status" value="Active" />
          <DetailRow label="Role" value="Secondary" />
          <DetailRow label="Bandwidth" value="50 Mbps" />
          <DetailRow label="Peering" value="Private" />
          <DetailRow label="BGP" value="Established" />
          <DetailRow label="Availability" value="Healthy" />

        </div>

      </section>

      <section className="panel">

        <PanelHeader
          title="ExpressRoute Architecture"
          subtitle="Private campus-to-Azure connectivity"
        />

        <div className="architecture-flow">

          <ArchitectureBox
            icon="🏫"
            title="Campus"
            text="Campus LAN"
          />

          <span className="flow-arrow">→</span>

          <ArchitectureBox
            icon="🔀"
            title="Campus Router"
            text="Redundant Edge"
          />

          <span className="flow-arrow">→</span>

          <ArchitectureBox
            icon="⇄"
            title="ExpressRoute"
            text="Private Circuit"
          />

          <span className="flow-arrow">→</span>

          <ArchitectureBox
            icon="☁"
            title="Azure VNet"
            text="Cloud + DR"
          />

        </div>

      </section>
    </>
  );


  /* ---------------- VPN PAGE ---------------- */

  const VPNPage = () => (
    <>
      <PageHeader
        title="VPN Backup"
        subtitle="Backup connectivity and failover management"
      />

      <section className="stats-grid">

        <StatCard
          title="VPN Status"
          value={vpnActive ? "Active" : "Standby"}
          status={vpnActive ? "● Failover" : "● Ready"}
          extra="Backup Path"
          icon="🔐"
          color="orange"
          backup={vpnActive}
        />

        <StatCard
          title="Encryption"
          value="Enabled"
          status="● Secure"
          extra="Encrypted Tunnel"
          icon="🔒"
          color="green"
        />

        <StatCard
          title="Internet Path"
          value="Available"
          status="● Connected"
          extra="Public Internet"
          icon="◎"
          color="blue"
        />

        <StatCard
          title="Role"
          value="Backup"
          status="● Standby"
          extra="Disaster Recovery"
          icon="↻"
          color="purple"
        />

      </section>

      <section className="two-column">

        <div className="panel">

          <PanelHeader
            title="VPN Configuration"
            subtitle="Site-to-Site backup tunnel"
          />

          <DetailRow label="Connection Type" value="Encrypted Tunnel" />
          <DetailRow label="Transport" value="Internet" />
          <DetailRow label="Encryption" value="Enabled" />
          <DetailRow label="Purpose" value="Backup Connectivity" />
          <DetailRow label="Status" value={vpnActive ? "Active" : "Standby"} />

        </div>

        <div className="panel">

          <PanelHeader
            title="Failover Status"
            subtitle="Automatic backup response"
          />

          <div className={`large-status ${vpnActive ? "failover" : "ready"}`}>

            <div className="large-status-icon">
              {vpnActive ? "⚠" : "✓"}
            </div>

            <h2>
              {vpnActive
                ? "Failover Active"
                : "Backup Ready"
              }
            </h2>

            <p>
              {vpnActive
                ? "VPN is providing backup connectivity while ExpressRoute A is unavailable."
                : "VPN is ready to provide backup connectivity if required."
              }
            </p>

          </div>

        </div>

      </section>
    </>
  );


  /* ---------------- PERFORMANCE PAGE ---------------- */

  const PerformancePage = () => (
    <>
      <PageHeader
        title="Network Performance"
        subtitle="Connectivity metrics and performance monitoring"
      />

      <section className="stats-grid">

        <StatCard
          title="Bandwidth"
          value="50 Mbps"
          status="● Normal"
          extra="Committed"
          icon="↕"
          color="blue"
        />

        <StatCard
          title="Latency"
          value="12 ms"
          status="● Low"
          extra="Average"
          icon="◌"
          color="green"
        />

        <StatCard
          title="Packet Loss"
          value="0.1%"
          status="● Normal"
          extra="Current"
          icon="⌁"
          color="purple"
        />

        <StatCard
          title="Availability"
          value="99.99%"
          status="● Healthy"
          extra="Target"
          icon="✓"
          color="orange"
        />

      </section>

      <section className="panel">

        <PanelHeader
          title="Traffic Overview"
          subtitle="Simulated network traffic"
        />

        <div className="large-chart">

          <div className="chart-y">
            <span>50 Mbps</span>
            <span>40 Mbps</span>
            <span>30 Mbps</span>
            <span>20 Mbps</span>
            <span>10 Mbps</span>
            <span>0</span>
          </div>

          <div className="chart-box">

            <div className="chart-grid"></div>
            <div className="chart-grid"></div>
            <div className="chart-grid"></div>
            <div className="chart-grid"></div>
            <div className="chart-grid"></div>

            <svg viewBox="0 0 800 250" preserveAspectRatio="none">

              <polyline
                points="
                0,190
                60,165
                120,180
                180,130
                240,145
                300,105
                360,125
                420,90
                480,115
                540,75
                600,100
                660,70
                720,90
                800,60
                "
              />

            </svg>

          </div>

        </div>

      </section>

      <section className="three-column">

        <MetricBox title="Peak Bandwidth" value="48.7 Mbps" />
        <MetricBox title="Average Latency" value="12 ms" />
        <MetricBox title="Packet Loss" value="0.1%" />

      </section>
    </>
  );


  /* ---------------- ALERTS PAGE ---------------- */

  const AlertsPage = () => (
    <>
      <PageHeader
        title="Alerts"
        subtitle="Network events and system notifications"
      />

      <section className="panel">

        <div className="alert-list">

          <Alert
            icon="✓"
            title="ExpressRoute B is healthy"
            text="Secondary connectivity path is operating normally."
            time="2 minutes ago"
            type="success"
          />

          <Alert
            icon="!"
            title="Capacity monitoring active"
            text="Network capacity is being monitored for future growth."
            time="18 minutes ago"
            type="warning"
          />

          <Alert
            icon="i"
            title="BGP routes updated"
            text="Routing information was successfully exchanged."
            time="32 minutes ago"
            type="info"
          />

          {erAFailed && (
            <Alert
              icon="⚠"
              title="ExpressRoute A failure detected"
              text="Traffic has been redirected to the secondary path and VPN backup."
              time="Just now"
              type="danger"
            />
          )}

        </div>

      </section>
    </>
  );


  /* ---------------- ACTIVITY PAGE ---------------- */

  const ActivityPage = () => (
    <>
      <PageHeader
        title="Activity Logs"
        subtitle="Recent network and system activity"
      />

      <section className="panel">

        <div className="activity-table">

          <div className="activity-head">
            <span>Time</span>
            <span>Event</span>
            <span>Component</span>
            <span>Status</span>
          </div>

          <ActivityRow
            time="10:42 PM"
            event="BGP route update"
            component="ExpressRoute"
            status="Success"
          />

          <ActivityRow
            time="10:36 PM"
            event="Gateway health check"
            component="ErGw1AZ"
            status="Success"
          />

          <ActivityRow
            time="10:21 PM"
            event="Traffic monitoring"
            component="Campus VNet"
            status="Running"
          />

          <ActivityRow
            time="09:58 PM"
            event="Connectivity check"
            component="Circuit B"
            status="Success"
          />

          {erAFailed && (
            <ActivityRow
              time="Just now"
              event="Failover triggered"
              component="Circuit A"
              status="Failed"
            />
          )}

        </div>

      </section>
    </>
  );


  /* ---------------- CONFIGURATION PAGE ---------------- */

  const ConfigurationPage = () => (
    <>
      <PageHeader
        title="Configuration"
        subtitle="Campus hybrid network configuration"
      />

      <section className="two-column">

        <div className="panel">

          <PanelHeader
            title="Virtual Network"
            subtitle="Azure VNet configuration"
          />

          <DetailRow label="VNet Name" value="Campus-VNet" />
          <DetailRow label="Address Space" value="10.0.0.0/16" />
          <DetailRow label="Location" value="Central India" />
          <DetailRow label="Subnet" value="10.0.1.0/24" />
          <DetailRow label="Gateway Subnet" value="10.0.255.0/27" />

        </div>

        <div className="panel">

          <PanelHeader
            title="ExpressRoute Gateway"
            subtitle="Azure network gateway"
          />

          <DetailRow label="Gateway Name" value="Campus-ExpressRoute-Gateway" />
          <DetailRow label="SKU" value="ErGw1AZ" />
          <DetailRow label="Gateway Type" value="ExpressRoute" />
          <DetailRow label="Virtual Network" value="Campus-VNet" />
          <DetailRow label="Status" value="Healthy" />

        </div>

      </section>

      <section className="panel">

        <PanelHeader
          title="Security & Resilience"
          subtitle="Design configuration"
        />

        <div className="config-grid">

          <ConfigItem title="Private Connectivity" value="Enabled" />
          <ConfigItem title="Dual Circuits" value="Planned" />
          <ConfigItem title="VPN Backup" value="Available" />
          <ConfigItem title="BGP Routing" value="Enabled" />
          <ConfigItem title="Monitoring" value="Enabled" />
          <ConfigItem title="Failover Testing" value="Planned" />

        </div>

      </section>
    </>
  );


  /* ---------------- DOCUMENTATION PAGE ---------------- */

  const DocumentationPage = () => (
    <>
      <PageHeader
        title="Documentation"
        subtitle="Project architecture and technical reference"
      />

      <section className="three-column">

        <DocCard
          icon="📐"
          title="Architecture"
          text="Campus LAN → ExpressRoute → Microsoft Network → Azure VNet"
        />

        <DocCard
          icon="🔄"
          title="Redundancy"
          text="Dual circuits, redundant routers, diverse paths and VPN backup."
        />

        <DocCard
          icon="📊"
          title="Cost Analysis"
          text="Compare ExpressRoute and Site-to-Site VPN using lifecycle cost."
        />

        <DocCard
          icon="🌐"
          title="BGP"
          text="Dynamic exchange of reachable routes between networks."
        />

        <DocCard
          icon="🛡"
          title="Disaster Recovery"
          text="Monitor health and test failover between connectivity paths."
        />

        <DocCard
          icon="☁"
          title="Azure VNet"
          text="Private network boundary for cloud services and DR."
        />

      </section>
    </>
  );


  /* ---------------- PAGE SELECTOR ---------------- */

  const renderPage = () => {

    switch (activePage) {

      case "Dashboard":
        return <DashboardPage />;

      case "Network Topology":
        return (
          <>
            <PageHeader
              title="Network Topology"
              subtitle="Interactive campus-to-Azure network architecture"
            />

            <section className="panel full-topology">

              <div className="big-topology">

                <ClickableNode
                  icon="🏫"
                  title="University Campus"
                  subtitle="Campus LAN"
                  onClick={() => setSelectedNode("Campus")}
                />

                <div className="big-routes">

                  <ClickableRoute
                    title="ExpressRoute A"
                    status={erAFailed ? "FAILED" : "Primary • 50 Mbps"}
                    failed={erAFailed}
                    onClick={() => setSelectedNode("ExpressRoute A")}
                  />

                  <ClickableRoute
                    title="ExpressRoute B"
                    status="Secondary • 50 Mbps"
                    secondary
                    onClick={() => setSelectedNode("ExpressRoute B")}
                  />

                  {vpnActive && (
                    <ClickableRoute
                      title="VPN Backup"
                      status="FAILOVER ACTIVE"
                      vpn
                      onClick={() => setSelectedNode("VPN Backup")}
                    />
                  )}

                </div>

                <ClickableNode
                  icon="☁"
                  title="Azure VNet"
                  subtitle="Cloud + Disaster Recovery"
                  azure
                  onClick={() => setSelectedNode("Azure VNet")}
                />

              </div>

              {selectedNode && (
                <NodeDetails
                  node={selectedNode}
                  onClose={() => setSelectedNode(null)}
                />
              )}

            </section>

            <section className="panel">

              <PanelHeader
                title="Simulation"
                subtitle="Test network resilience"
              />

              {!erAFailed ? (
                <button className="danger-button" onClick={simulateFailure}>
                  ⚠ Simulate ExpressRoute A Failure
                </button>
              ) : (
                <button className="restore-button" onClick={restoreNetwork}>
                  ✓ Restore Network
                </button>
              )}

            </section>
          </>
        );

      case "ExpressRoute":
        return <ExpressRoutePage />;

      case "VPN Backup":
        return <VPNPage />;

      case "Performance":
        return <PerformancePage />;

      case "Alerts":
        return <AlertsPage />;

      case "Activity Logs":
        return <ActivityPage />;

      case "Configuration":
        return <ConfigurationPage />;

      case "Documentation":
        return <DocumentationPage />;

      default:
        return <DashboardPage />;
    }
  };


  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="azure-logo">
            ☁
          </div>

          <div>
            <h2>Azure Campus</h2>
            <span>Network Control</span>
          </div>

        </div>

        <nav>

          <div className="nav-title">
            MAIN
          </div>

          {sidebarItem("▦", "Dashboard")}
          {sidebarItem("⌘", "Network Topology")}
          {sidebarItem("◉", "ExpressRoute")}
          {sidebarItem("↔", "VPN Backup")}

          <div className="nav-title">
            MONITORING
          </div>

          {sidebarItem("◒", "Performance")}
          {sidebarItem("⚠", "Alerts")}
          {sidebarItem("◫", "Activity Logs")}

          <div className="nav-title">
            MANAGEMENT
          </div>

          {sidebarItem("⚙", "Configuration")}
          {sidebarItem("ⓘ", "Documentation")}

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-avatar">
            SH
          </div>

          <div>
            <strong>Network Admin</strong>
            <small>Campus Project</small>
          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-content">

        {renderPage()}

        <footer>

          <span>
            Azure ExpressRoute Design Study
          </span>

          <span>
            University Campus • Team T249
          </span>

          <span>
            React Prototype
          </span>

        </footer>

      </main>

    </div>
  );
}


/* ========================================================= */
/* REUSABLE COMPONENTS                                      */
/* ========================================================= */

function PageHeader({ title, subtitle }) {
  return (
    <header className="topbar">

      <div>

        <div className="breadcrumb">
          Azure Campus / {title}
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>

      </div>

      <div className="top-actions">

        <button className="icon-btn">
          🔔
        </button>

        <div className="system-status">

          <span className="pulse"></span>

          All Systems Operational

        </div>

      </div>

    </header>
  );
}


function PanelHeader({
  title,
  subtitle,
  badge,
  greenBadge
}) {
  return (
    <div className="panel-header">

      <div>

        <h2>{title}</h2>

        {subtitle && (
          <p>{subtitle}</p>
        )}

      </div>

      {badge && (
        <span className={greenBadge ? "health-score" : "live-badge"}>
          {badge}
        </span>
      )}

    </div>
  );
}


function StatCard({
  title,
  value,
  status,
  extra,
  icon,
  color,
  danger,
  backup
}) {
  return (
    <div
      className={`stat-card ${
        danger ? "danger-card" : ""
      } ${backup ? "backup-card" : ""}`}
    >

      <div className="stat-top">

        <span>{title}</span>

        <div className={`stat-icon ${color}`}>
          {icon}
        </div>

      </div>

      <h2>{value}</h2>

      <div className="stat-bottom">

        <span
          className={
            danger
              ? "danger"
              : backup
              ? "success"
              : status.includes("Ready")
              ? "warning"
              : "success"
          }
        >
          {status}
        </span>

        <span>{extra}</span>

      </div>

    </div>
  );
}


function ClickableNode({
  icon,
  title,
  subtitle,
  azure,
  onClick
}) {
  return (
    <button
      className={`network-node ${
        azure ? "azure-node" : ""
      }`}
      onClick={onClick}
    >

      <div
        className={`node-icon ${
          azure ? "azure-icon" : ""
        }`}
      >
        {icon}
      </div>

      <strong>{title}</strong>

      <small>{subtitle}</small>

    </button>
  );
}


function ClickableRoute({
  title,
  status,
  failed,
  secondary,
  vpn,
  onClick
}) {
  return (
    <button
      className={`route ${
        failed ? "route-failed" : ""
      } ${vpn ? "vpn-route" : ""}`}
      onClick={onClick}
    >

      <div className="route-label">
        {title}
      </div>

      <div
        className={`line ${
          secondary ? "secondary-line" : ""
        } ${vpn ? "vpn-line" : ""}`}
      >

        {!failed && (
          <span className="traffic"></span>
        )}

      </div>

      <small>{status}</small>

    </button>
  );
}


function NodeDetails({ node, onClose }) {

  const data = {

    "Campus": {
      title: "University Campus",
      items: [
        ["Network", "Campus LAN"],
        ["Users", "Students + Faculty"],
        ["Routers", "Router A + Router B"],
        ["Role", "On-Premises Network"]
      ]
    },

    "ExpressRoute A": {
      title: "ExpressRoute A",
      items: [
        ["Status", "Primary"],
        ["Bandwidth", "50 Mbps"],
        ["Connectivity", "Private"],
        ["BGP", "Established"],
        ["Peering", "Private"]
      ]
    },

    "ExpressRoute B": {
      title: "ExpressRoute B",
      items: [
        ["Status", "Secondary"],
        ["Bandwidth", "50 Mbps"],
        ["Connectivity", "Private"],
        ["BGP", "Established"],
        ["Role", "Redundancy"]
      ]
    },

    "VPN Backup": {
      title: "VPN Backup",
      items: [
        ["Status", "Failover"],
        ["Connection", "Encrypted Tunnel"],
        ["Transport", "Internet"],
        ["Role", "Backup"]
      ]
    },

    "Azure VNet": {
      title: "Azure VNet",
      items: [
        ["Name", "Campus-VNet"],
        ["Address Space", "10.0.0.0/16"],
        ["Location", "Central India"],
        ["Gateway", "ErGw1AZ"],
        ["Purpose", "Cloud + DR"]
      ]
    }

  };

  const current = data[node];

  return (
    <div className="node-details">

      <div>

        <h3>{current.title}</h3>

        <div className="details-grid">

          {current.items.map((item, index) => (
            <div key={index}>

              <span>{item[0]}</span>

              <strong>{item[1]}</strong>

            </div>
          ))}

        </div>

      </div>

      <button
        className="close-details"
        onClick={onClose}
      >
        ✕
      </button>

    </div>
  );
}


function HealthRow({ title, detail }) {
  return (
    <div className="health-item">

      <div>

        <span>{title}</span>

        <small>{detail}</small>

      </div>

      <strong className="success">
        ● Healthy
      </strong>

    </div>
  );
}


function MetricRow({ label, value }) {
  return (
    <div className="metric-row-single">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


function DetailRow({ label, value }) {
  return (
    <div className="detail-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


function ArchitectureBox({
  icon,
  title,
  text
}) {
  return (
    <div className="architecture-box">

      <div className="architecture-icon">
        {icon}
      </div>

      <strong>{title}</strong>

      <small>{text}</small>

    </div>
  );
}


function MetricBox({ title, value }) {
  return (
    <div className="metric-box">

      <span>{title}</span>

      <strong>{value}</strong>

    </div>
  );
}


function Alert({
  icon,
  title,
  text,
  time,
  type
}) {
  return (
    <div className="alert-item">

      <div className={`alert-icon ${type}-bg`}>
        {icon}
      </div>

      <div>

        <strong>{title}</strong>

        <p>{text}</p>

        <small>{time}</small>

      </div>

    </div>
  );
}


function ActivityRow({
  time,
  event,
  component,
  status
}) {
  return (
    <div className="activity-row">

      <span>{time}</span>

      <strong>{event}</strong>

      <span>{component}</span>

      <span
        className={
          status === "Failed"
            ? "danger"
            : "success"
        }
      >
        ● {status}
      </span>

    </div>
  );
}


function ConfigItem({
  title,
  value
}) {
  return (
    <div className="config-item">

      <span>{title}</span>

      <strong className="success">
        ● {value}
      </strong>

    </div>
  );
}


function DocCard({
  icon,
  title,
  text
}) {
  return (
    <div className="doc-card">

      <div className="doc-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button>
        View Details →
      </button>

    </div>
  );
}

export default App;