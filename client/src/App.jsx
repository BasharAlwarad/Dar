import { Diagrams } from './components';

export default function App() {
  const chart1 = `
      graph TD
        A[Client] --> B[Load Balancer]
        B --> C[Server1]
        B --> D[Server2]
    `;

  const chart2 = `
      gantt
    title A Gantt Diagram

    Completed task            :done,    task, 2024-01-06,2024-01-08
    Active task               :active,  task2, 2024-01-09, 3d
    Future task               :         task3, after task2, 5d
    Future task2              :         task4, after task3, 5d
    `;

  const chart3 = `
      flowchart RL
    A(Christmas) -->|<h1>Hello world!</h1>| B(Go shopping)
    style A fill:red,stroke:black,stroke-width:4px,shadow:shadow
    B --> C{Let me think}
    style B fill:green,stroke:black,stroke-width:4px,shadow:shadow
    C -->|One| D[Laptop]
    style C fill:blue,stroke:black,stroke-width:4px,shadow:shadow
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
    style D fill:yellow,stroke:black,stroke-width:2px,shadow:shadow
    style E fill:brown,stroke:black,stroke-width:2px,shadow:shadow
    style F fill:navy,stroke:black,stroke-width:2px,shadow:shadow
    `;

  const chart4 = `
  gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    excludes weekends

    section Demo Section
    First task  : done,a1, 2023-12-24, 9d
    Second task : active,a2, 2024-01-01, 14d
    Milestone   : milestone, m1, after a2, 0d
    Critical task   : crit,a3, 2024-01-10, 9d
    Last task   : a4,after a2, 8d
    Project end : milestone, m2, 2024-02-02, 0d

    section Help the channel out
    Like      :active,a5,2024-01-5  , 2d
    Comment : a6,after a5, 7d
    Subscribe   : crit,a7,after a6,8d

  `;

  let x = 10;

  setInterval(() => {
    x++;
  }, 500);

  const chart5 = `
  pie showData
    title PetterTech's content
    "Windows" : 130
    "Azure" : 28
    "PowerShell" : ${x}
`;

  const chart6 = `
  sankey-beta
Work-week,Writing,14
Work-week,Drawing,10
Work-week,Meetings,16
  `;

  const chart7 = `
  gitGraph:
    commit id: "Initial commit"
    commit id: "Did stuff"

    branch branchingOff

    checkout branchingOff
    commit id: "Did some branch stuff"
    commit id: "Did more branch stuff"
    checkout main
    commit id: "Did some more stuff"
    merge branchingOff id: "Merging back"

    commit id: "Post merge stuff"
    commit id: "Final?"
  `;

  const chart8 = `
  mindmap
  root((My brain))
    ))Dungeons & Dragons((
      {{One campaign}}
        ((DM tasks))
          Aethenia
            Kingdoms
            Cities
            Villages
            NPCs
            Deities
          Prepare
          Run
          Follow up
          Help players
      {{Another Campaign}}
        ((Halldur
        Trubadur))
          Bard
          Dwarven heritage
          Support
          Spells
          Linene
    ))YouTube((
      {{Follow up}}
        Comments
        Suggestions
      {{Create content}}
        )Azure(
          EPAC
          Arc
          AVD
          Dev Box
          Spot VMs
        Code stuff
          Powershell
          Bicep
          Mermaid
          IaC
        )Windows 365(
            Boot
            Use
            Features
            News
  `;

  const chart9 = `
  %%{init: { 'logLevel': 'debug', 'theme': 'base' } }%%
timeline
    title PetterTech YouTube channel
    2015: Creation of channel
    2021: February <br> First video posted : June <br> Rebrand to PetterTech : October <br> First video to hit 1000 views
    2022: August <br> Reached a total of 25 uploads : September <br> First video to hit 10k views
    2023: October <br> Reached 1000 subscribers <br> : November <br> Eligible for YouTube partnership
  `;

  return (
    <>
      {/* <Diagrams chart={chart1} /> */}
      {/* <Diagrams chart={chart2} /> */}
      {/* <Diagrams chart={chart3} /> */}
      {/* <Diagrams chart={chart4} /> */}
      <Diagrams />
      {/* <Diagrams chart={chart5} /> */}
      {/* <Diagrams chart={chart6} /> */}
      {/* <Diagrams chart={chart7} /> */}
      {/* <Diagrams chart={chart8} /> */}
      {/* <Diagrams chart={chart9} /> */}
    </>
  );
}
