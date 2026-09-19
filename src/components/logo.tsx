import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Momento home">
      MOMENT<span className="logo-o" aria-hidden="true"><i /></span>
    </Link>
  );
}
