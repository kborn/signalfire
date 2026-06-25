import NavLink from '@/app/nav-link';

type SubmitNavLinkProps = {
  onClick?: () => void;
};

export function SubmitNavLink({ onClick }: SubmitNavLinkProps) {
  return (
    <NavLink href="/submit" className="site-submit-link" onClick={onClick}>
      Contribute
    </NavLink>
  );
}
