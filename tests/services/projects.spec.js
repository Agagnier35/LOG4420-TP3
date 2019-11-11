const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const projectsServiceFactory = require('../../services/yaml/projects.js')

const projectsFilepath = './data/projects.yml'

const fsFactory = filepath => yamlContent => {
  return {
    readFile: (path, enc, callback) => {
      if (path === filepath && enc === 'utf8') {
        callback(null, yamlContent)
      } else {
        callback(new Error('File not found'), null)
      }
    }
  }
}

describe('Projects service', () => {
  describe('getProjects', () => {
    it('should load projects from yaml file', done => {
      const yamlContent = `---
  - id: myid
    title:
      fr: French title
      en: English title
    description:
      fr: "French description"
      en: "English description"
    publications:
      - pub1
      - pub2
  `
      const fs = fsFactory(projectsFilepath)(yamlContent)

      const projectsService = projectsServiceFactory(fs)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.equal(null)

        const expectedProjects = [
          {
            id: 'myid',
            title: 'French title',
            description: 'French description',
            publications: [ 'pub1', 'pub2' ]
          }
        ]
        expect(projects).to.eql(expectedProjects)
        done()
      })
    })

    it('should send error if file does not exist', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('unknown path')(yamlContent)

      const projectsService = projectsServiceFactory(fs)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.not.equal(null)
        expect(projects).to.equal(null)
        done()
      })
    })

    it('should send empty array if file is empty', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('./data/projects.yml')(yamlContent)

      const projectsService = projectsServiceFactory(fs)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.equal(null)
        expect(projects).to.eql([])
        done()
      })
    })

    it('should put empty array for undefined publications in yaml file', done => {
      const yamlContent = `---
  - id: myid
    title:
      fr: French title
      en: English title
    description:
      fr: "French description"
      en: "English description"
  `
      const fs = fsFactory(projectsFilepath)(yamlContent)

      const projectsService = projectsServiceFactory(fs)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.equal(null)

        const expectedProjects = [
          {
            id: 'myid',
            title: 'French title',
            description: 'French description',
            publications: []
          }
        ]
        expect(projects).to.eql(expectedProjects)
        done()
      })
    })
  })

  describe('getProjectsById', () => {
    it('should send error if file does not exist', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('unknown path')(yamlContent)

      const projectsService = projectsServiceFactory(fs)

      projectsService.getProjectById('fr')({})('')((err, projects) => {
        expect(err).to.not.equal(null)
        expect(projects).to.equal(null)
        done()
      })
    })

    it('should get specific project by id', done => {
      const yamlContent = `---
- _id: myid
  title:
    fr: French title
    en: English title
  description:
    fr: "French description"
    en: "English description"
  publications:
    - pub1
    - pub2
  `
      const fs = fsFactory(projectsFilepath)(yamlContent)
      const projectsService = projectsServiceFactory(fs)
      const translationObjErr = { 'PROJECTS': { 'PROJECT_NOT_FOUND_MSG': 'Not found' } }

      projectsService.getProjectById('fr')(translationObjErr)('myid')((err, project) => {
        expect(err).to.equal(null)

        const expectedProject = {
          _id: 'myid',
          title: 'French title',
          description: 'French description',
          publications: [ 'pub1', 'pub2' ]
        }

        expect(project).to.eql(expectedProject)
        done()
      })
    })

    it('should return null for non-existant project', done => {
      const yamlContent = `---
- id: myid
  title:
    fr: French title
    en: English title
  description:
    fr: "French description"
    en: "English description"
  publications:
    - pub1
    - pub2
  `
      const fs = fsFactory(projectsFilepath)(yamlContent)
      const projectsService = projectsServiceFactory(fs)
      const translationObjErr = { 'PROJECTS': { 'PROJECT_NOT_FOUND_MSG': 'Not found' } }

      projectsService.getProjectById(translationObjErr)('fr')('non-existant-id')((err, project) => {
        expect(err).to.not.eql(null)
        expect(project).to.eql(null)
        done()
      })
    })
  })
})
