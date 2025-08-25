import { Link } from 'react-scroll';

const Outline = ({ modules, activeModuleId, onModuleClick }) => {
  return (
    <div className="outline-sidebar">
      {modules.map(module => (
        <Link
          key={module.id}
          activeClass="active" // automatically adds active class to active elem
          to={module.id} // which module to scroll to
          spy={true} // used to track scrolling
          smooth={true}
          offset={-230}
          duration={300}
        >
          {module.name}
        </Link>
      ))}
    </div>
  );
};

export default Outline;
