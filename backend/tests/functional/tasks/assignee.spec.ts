import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no filtra
 * datos de cuenta, y responsable sin nombre.
 *
 * Cada test mira la tarea por los dos caminos por los que se «obtiene»: suelta
 * (`GET /tasks/:id`) y dentro de la lista (`GET /tasks`).
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-10-11'

  async function sesion(client: any, fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  async function assigneeSuelta(client: any, token: string, task: Task) {
    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data.assignee
  }

  async function assigneeEnLista(client: any, token: string, task: Task) {
    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    const fila = response.body().data.find((t: { id: number }) => t.id === task.id)
    return fila.assignee
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    for (const assignee of [
      await assigneeSuelta(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('la tarea no filtra el email ni otros datos de la cuenta', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    for (const assignee of [
      await assigneeSuelta(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      assert.notProperty(assignee, 'email')
      assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
      // «Ningún otro dato»: lo justo para identificarlo y nada más.
      assert.sameMembers(Object.keys(assignee), ['id', 'fullName', 'initials'])
    }
  })

  test('un responsable sin nombre llega con nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null, 'ada@example.com')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    for (const assignee of [
      await assigneeSuelta(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      assert.isNull(assignee.fullName)
      // Las mismas que da la cuenta sin nombre en `Auth | iniciales`.
      assert.equal(assignee.initials, 'AE')
    }
  })
})
