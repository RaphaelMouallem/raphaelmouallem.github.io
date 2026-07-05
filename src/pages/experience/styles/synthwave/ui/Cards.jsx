import IntroCard from './sections/IntroCard'
import AboutCards from './sections/AboutCards'
import ProjectsLayer from './sections/ProjectsLayer'
import ContactCard from './sections/ContactCard'
import FooterCard from './sections/FooterCard'

export default function Cards({ section, isMobile, scrollCard, progress }) {
  return (
    <>
      <IntroCard visible={section === 'intro'} />
      <AboutCards visible={section === 'about'} isMobile={isMobile} scrollCard={scrollCard} />
      <ProjectsLayer visible={section === 'projects'} progress={progress} isMobile={isMobile} />
      <ContactCard visible={section === 'contact'} isMobile={isMobile} />
      <FooterCard visible={section === 'footer'} isMobile={isMobile} />
    </>
  )
}
