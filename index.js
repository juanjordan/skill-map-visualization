const md = new markdownit();

const removeExtension = text => text.split('.').shift();

// This variable will live here until the script is updated to understand profiles.
const profileEdges = [
  { from: 'computer-science', to: 'basic-data-structures.md' },
  { from: 'front-end', to: 'basic-form-creation.md' },
  { from: 'front-end', to: 'cloud-based-authentication-firebase-auth.md' },
  { from: 'front-end', to: 'cloud-based-persistance-firebase.md' },
  { from: 'computer-science', to: 'collaborative-version-control-system.md' },
  { from: 'back-end', to: 'crud-functions.md' },
  { from: 'front-end', to: 'data-driven-interfaces.md' },
  { from: 'computer-science', to: 'functional-programming-fundamentals.md' },
  { from: 'front-end', to: 'graphic-user-interface.md' },
  { from: 'front-end', to: 'interface-library-react.md' },
  { from: 'computer-science', to: 'javascript-asynchrony.md' },
  { from: 'computer-science', to: 'mathematical-problem-solving.md' },
  { from: 'back-end', to: 'module-authorship.md' },
  { from: 'back-end', to: 'node-js-introduction.md' },
  { from: 'front-end', to: 'offline-first.md' },
  { from: 'computer-science', to: 'programming-fundamentals.md' },
  { from: 'computer-science', to: 'recursion-understanding.md' },
  { from: 'front-end', to: 'responsive-web-design.md' },
  { from: 'front-end', to: 'router-library-react-router.md' },
  { from: 'front-end', to: 'single-page-application.md' },
  { from: 'front-end', to: 'task-scheduling.md' },
  { from: 'back-end', to: 'terminal-interaction.md' },
  { from: 'computer-science', to: 'test-driven-development-introduction.md' },
  { from: 'front-end', to: 'user-interface-layout.md' },
  { from: 'computer-science', to: 'version-control-system.md' },
  { from: 'back-end', to: 'web-application-deployment.md' },
];

const nodes = (skills, microSkills, profiles = ['front-end', 'back-end', 'computer-science']) => {
  return microSkills
    .map(microSkill => ({
      id: microSkill.filename,
      label: removeExtension(microSkill.filename),
      group: 'micro-skill',
      shape: 'box',
      color: 'pink',
      margin: 10,
      title: md.render(microSkill.content),
    }))
    .concat(
      skills.map(skill => ({
        id: skill.filename,
        label: removeExtension(skill.filename),
        group: 'skill',
        shape: 'box',
        color: '#FF878F',
        margin: 10,
      })),
    )
    .concat(
      profiles.map(profile => ({
        id: profile,
        label: profile,
        group: 'profile',
        size: 80,
      })),
    );
};

const edges = skills => {
  return skills
    .flatMap(skill =>
      skill.microSkills.map(microSkill => ({
        from: `${microSkill}.md`,
        to: skill.filename,
        color: 'black',
      })),
    )
    .concat(profileEdges);
};

const draw = () => {
  fetch('./script-output.json')
    .then(result => result.json())
    .then(data => console.log(data) || data)
    .then(json => {
      console.log(nodes(json.skillsDefinition, json.microSkillsDefinition));
      console.log(edges(json.skillsDefinition));

      const data = {
        nodes: nodes(json.skillsDefinition, json.microSkillsDefinition),
        edges: edges(json.skillsDefinition),
      };

      const options = {
        nodes: {
          scaling: {
            min: 16,
            max: 32,
          },
        },
        edges: {
          color: 'black',
          smooth: false,
        },
        physics: {
          barnesHut: { gravitationalConstant: -30000 },
          stabilization: { iterations: 2500 },
        },
        groups: {
          profile: {
            shape: 'diamond',
            color: 'orange',
          },
        },
      };

      // network will be used later to call events.
      const network = new vis.Network(document.querySelector('.visualization'), data, options);
    });
};

window.addEventListener('load', draw);
