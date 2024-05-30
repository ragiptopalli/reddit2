export default function Footer() {
  return (
    <footer className='md:hidden sticky bottom-0 bg-background text-center w-full text-zinc-400 py-5 px-7 border-t'>
      <small>&copy; {new Date().getFullYear()} All rights reserved.</small>
    </footer>
  );
}
